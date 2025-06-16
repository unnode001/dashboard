// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';

// 模拟函数，根据时间范围生成不同的数据
const generateMockData = (range) => {
  let multiplier = 1;
  if (range === '30d') multiplier = 4;
  if (range === '90d') multiplier = 12;
  
  // 简单地将数字乘以一个系数来模拟不同时间范围的数据
  return {
    stats: {
      todayUsage: { conversations: 128 * multiplier, tokens: 345000 * multiplier },
      cost: { today: 12.50, month: 289.90 * multiplier },
      apiKeys: { active: 5, total: 8 },
    },
    models: [
        { name: 'GPT-4o', status: 'Operational' },
        { name: 'Claude 3 Opus', status: 'Operational' },
        { name: 'Gemini 1.5 Pro', status: 'Degraded Performance' },
        { name: 'Llama 3 70B', status: 'Offline' },
    ],
    // 图表数据可以根据range动态生成更复杂的，这里为了简化仅返回固定数据
    chartData: [
        { date: 'Day 1', tokens: Math.floor(Math.random() * 200000) + 100000 },
        { date: 'Day 2', tokens: Math.floor(Math.random() * 200000) + 100000 },
        { date: 'Day 3', tokens: Math.floor(Math.random() * 200000) + 100000 },
        { date: 'Day 4', tokens: Math.floor(Math.random() * 200000) + 100000 },
        { date: 'Day 5', tokens: Math.floor(Math.random() * 200000) + 100000 },
        { date: 'Day 6', tokens: Math.floor(Math.random() * 200000) + 100000 },
        { date: 'Day 7', tokens: Math.floor(Math.random() * 200000) + 100000 },
    ],
    recentActivities: [
      { id: 'ACT-001', user: '用户 A', action: '开始了一个新的对话', time: '5分钟前' },
      { id: 'ACT-002', user: 'API Key #3', action: '调用了 GPT-4o 模型', time: '12分钟前' },
      { id: 'ACT-003', user: '用户 B', action: '开始了一个新的对话', time: '28分钟前' },
    ]
  };
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '7d'; // 默认为7天

  await new Promise(resolve => setTimeout(resolve, 600)); // 模拟网络延迟

  const data = generateMockData(range);
  return NextResponse.json(data);
}