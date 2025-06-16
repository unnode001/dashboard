// src/app/api/keys/route.js
import { NextResponse } from 'next/server';

// 在真实应用中，这会是一个数据库
let apiKeys = [
    { id: 'key-1', service: 'OpenAI', key: 'sk-xxxx...xxxx1234', createdAt: new Date().toISOString() },
    { id: 'key-2', service: 'Anthropic', key: 'ak-xxxx...xxxx5678', createdAt: new Date().toISOString() },
];

export async function GET() {
    return NextResponse.json(apiKeys);
}

export async function POST(request) {
    const { service, key } = await request.json();
    if (!service || !key) {
        return NextResponse.json({ error: 'Service and key are required' }, { status: 400 });
    }
    const newKey = {
        id: `key-${Date.now()}`,
        service,
        // 在真实应用中，您永远不应该存储完整的密钥，而是存储加密版本或仅存储部分信息
        key: `${key.substring(0, 5)}...${key.substring(key.length - 4)}`,
        createdAt: new Date().toISOString(),
    };
    apiKeys.push(newKey);
    return NextResponse.json(newKey, { status: 201 });
}

export async function DELETE(request) {
    const { id } = await request.json();
    const initialLength = apiKeys.length;
    apiKeys = apiKeys.filter(k => k.id !== id);
    if (apiKeys.length < initialLength) {
        return NextResponse.json({ message: 'Key deleted' }, { status: 200 });
    } else {
        return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }
}