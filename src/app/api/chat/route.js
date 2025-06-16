// src/app/api/chat/route.js
import { NextResponse } from 'next/server';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 特殊标记，用于在流中区分元数据和文本内容
const METADATA_PREFIX = "METADATA::";

export async function POST(request) {
  try {
    const { prompt, model, temperature } = await request.json();

    const stream = new ReadableStream({
      async start(controller) {
        const responseText = `这是一个基于模型 '${model}' 和温度 ${temperature} 生成的示例响应。流式传输可以提供更快的首字节时间，并改善用户体验。每个词语都是作为一个独立的chunk发送的。`;
        const responseChunks = responseText.split(' ');

        for (const chunk of responseChunks) {
          controller.enqueue(new TextEncoder().encode(chunk + " "));
          await sleep(60);
        }

        // --- 模拟用量计算 ---
        const promptTokens = prompt.length * 2; // 简单模拟
        const completionTokens = responseText.length * 2;
        const totalTokens = promptTokens + completionTokens;
        const cost = ((promptTokens * 0.005 + completionTokens * 0.015) / 1000).toFixed(6);

        const metadata = {
          usage: {
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            total_tokens: totalTokens,
            cost: cost
          }
        };

        // --- 发送元数据 ---
        // 使用特殊前缀来标记这是元数据，而不是正文内容
        controller.enqueue(new TextEncoder().encode(`${METADATA_PREFIX}${JSON.stringify(metadata)}`));

        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}