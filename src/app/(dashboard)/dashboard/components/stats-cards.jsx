// src/app/(dashboard)/dashboard/components/stats-cards.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, DollarSign, KeyRound, MessageSquareText, Server } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </CardContent>
  </Card>
);

// 定义状态到颜色的映射
const statusConfig = {
  'Operational': { text: '运行正常', color: 'bg-green-500' },
  'Degraded Performance': { text: '性能下降', color: 'bg-yellow-500' },
  'Offline': { text: '离线', color: 'bg-red-500' },
  'default': { text: '未知', color: 'bg-gray-400' }
};

const ModelStatus = ({ models = [] }) => (
  <Card className="col-span-1 lg:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Server className="mr-2 h-5 w-5" />
        模型状态
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {models.map((model) => {
        const currentStatus = statusConfig[model.status] || statusConfig.default;
        return (
          <div key={model.name} className="flex items-center justify-between">
            <span className="text-sm font-medium">{model.name}</span>
            <div className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${currentStatus.color}`}></span>
              <span className="text-sm text-muted-foreground">{currentStatus.text}</span>
            </div>
          </div>
        )
      })}
    </CardContent>
  </Card>
);

export default function StatsCards({ stats, config, models, onlyCards, onlyModel }) {
  const { todayUsage, cost, apiKeys } = stats;

  if (onlyCards) {
    return (
      <div className="grid gap-4">
        <StatCard
          title="今日对话数"
          value={todayUsage.conversations}
          subtext="今日已完成的对话总数"
          icon={MessageSquareText}
        />
        <StatCard
          title="今日Token消耗"
          value={todayUsage.tokens.toLocaleString()}
          subtext="所有模型消耗的Token总和"
          icon={Cpu}
        />
        {config.showCost && (
          <StatCard
            title="本月预估成本"
            value={`$${cost.month.toFixed(2)}`}
            subtext={`今日: $${cost.today.toFixed(2)}`}
            icon={DollarSign}
          />
        )}
        <StatCard
          title="有效API密钥"
          value={`${apiKeys.active} / ${apiKeys.total}`}
          subtext="当前启用中的API密钥数量"
          icon={KeyRound}
        />
      </div>
    );
  }
  if (onlyModel) {
    return <ModelStatus models={models} />;
  }
  // 默认全部
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="今日对话数"
        value={todayUsage.conversations}
        subtext="今日已完成的对话总数"
        icon={MessageSquareText}
      />
      <StatCard
        title="今日Token消耗"
        value={todayUsage.tokens.toLocaleString()}
        subtext="所有模型消耗的Token总和"
        icon={Cpu}
      />
      {config.showCost && (
        <StatCard
          title="本月预估成本"
          value={`$${cost.month.toFixed(2)}`}
          subtext={`今日: $${cost.today.toFixed(2)}`}
          icon={DollarSign}
        />
      )}
      <StatCard
        title="有效API密钥"
        value={`${apiKeys.active} / ${apiKeys.total}`}
        subtext="当前启用中的API密钥数量"
        icon={KeyRound}
      />
      {config.showModels && <ModelStatus models={models} />}
    </div>
  );
}