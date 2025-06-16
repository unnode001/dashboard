import { NextResponse } from 'next/server';

// 模拟的数据库或服务层数据
const allLogs = Array.from({ length: 100 }, (_, i) => {
  const status = Math.random() > 0.8 ? (Math.random() > 0.5 ? 429 : 500) : 200;
  const model = ['GPT-4o', 'Claude 3 Opus', 'Gemini 1.5 Pro'][i % 3];
  const latency = Math.floor(Math.random() * 1500) + 200;
  const promptTokens = Math.floor(Math.random() * 1000) + 50;
  const completionTokens = Math.floor(Math.random() * 1000) + 50;

  return {
    id: `log-${i + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    user: `user-${(i % 10) + 1}`,
    model: model,
    status: status,
    latency: latency,
    tokens: {
      prompt: promptTokens,
      completion: completionTokens,
      total: promptTokens + completionTokens
    },
    cost: ((promptTokens * 0.005 + completionTokens * 0.015) / 1000).toFixed(5),
    prompt: `这是一个日志条目 ${i + 1} 的示例提示。用户询问了关于 ${model} 的问题。`,
    response: `这是一个日志条目 ${i + 1} 的示例响应。AI 回复了其能力相关的细节。`
  };
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // 获取所有查询参数
  const query = searchParams.get('query') || '';
  const statusFilter = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder'); // 'asc' or 'desc'
  const isExport = searchParams.get('export') === 'true';

  let filteredLogs = [...allLogs];

  // 1. 过滤逻辑
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  }

  if (query) {
    filteredLogs = filteredLogs.filter(log =>
      log.prompt.toLowerCase().includes(query.toLowerCase()) ||
      log.user.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (statusFilter && statusFilter !== 'all') {
    filteredLogs = filteredLogs.filter(log => {
      if (statusFilter === 'success') return log.status === 200;
      if (statusFilter === 'failed') return log.status !== 200;
      return true;
    });
  }

  // 2. 排序逻辑
  if (sortBy && sortOrder) {
    filteredLogs.sort((a, b) => {
      const getNestedValue = (obj, path) => path.split('.').reduce((o, k) => (o || {})[k], obj);
      const valA = getNestedValue(a, sortBy);
      const valB = getNestedValue(b, sortBy);

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 3. 决定返回分页数据还是全量数据
  if (isExport) {
    // 导出时，返回所有过滤和排序后的数据
    return NextResponse.json({ data: filteredLogs });
  } else {
    // 正常浏览时，返回分页数据
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const total = filteredLogs.length;
    const paginatedLogs = filteredLogs.slice((page - 1) * limit, page * limit);

    await new Promise(resolve => setTimeout(resolve, 400)); // 模拟网络延迟

    return NextResponse.json({
      data: paginatedLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
}
