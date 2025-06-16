// src/app/(dashboard)/dashboard/page.jsx
'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { Settings } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ConfigModal from './components/config-modal';
import DashboardSkeleton from './components/dashboard-skeleton'; // 引入骨架屏
import RecentActivity from './components/recent-activity';
import StatsCards from './components/stats-cards';
import UsageChart from './components/usage-chart';

const initialConfig = {
  showCost: true,
  showModels: true,
  showChart: true,
  showActivity: true,
  refreshInterval: 0, // 0 表示不刷新
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(initialConfig);
  const [timeRange, setTimeRange] = useState('7d');

  // 使用 useRef 存储 interval ID，避免不必要的重渲染
  const intervalRef = useRef(null);

  // 从 localStorage 读取配置
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('dashboardConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (e) { console.error("Failed to parse config from localStorage", e); }
  }, []);

  // 配置变化时存入 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dashboardConfig', JSON.stringify(config));
    } catch (e) { console.error("Failed to save config to localStorage", e); }
  }, [config]);

  // 数据获取函数，使用 useCallback 避免在 useEffect 中重复创建
  const fetchData = useCallback(async () => {
    // 仅在非刷新时显示骨架屏
    if (!intervalRef.current) {
      setLoading(true);
    }
    setError(null);
    try {
      // 附加时间范围参数
      const response = await axios.get(`/api/dashboard?range=${timeRange}`);
      setData(response.data);
    } catch (err) {
      setError('无法加载仪表盘数据，请稍后重试。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]); // 依赖 timeRange，当它变化时重新获取数据

  // 主要的 Effect，负责初始加载和时间范围变化
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 自动刷新逻辑
  useEffect(() => {
    // 清除旧的 interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (config.refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        console.log('Auto refreshing data...');
        fetchData();
      }, config.refreshInterval);
    }

    // 组件卸载时清除 interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config.refreshInterval, fetchData]);

  const renderContent = () => {
    if (loading) {
      return <DashboardSkeleton />;
    }
    if (error) {
      return <div className="text-red-500">{error}</div>;
    }
    if (data) {
      return (
        <div className="flex flex-col gap-8 mt-6 h-full">
          {/* 上半部分 */}
          <div className="flex flex-1 gap-8 min-h-[320px] items-stretch">
            {/* 左侧统计卡片区，拉伸高度并底部对齐 */}
            <div className="flex flex-col gap-4 flex-[2] min-w-[260px] max-w-[340px] h-full justify-between">
              <div className="flex flex-col gap-4 h-full justify-between flex-1">
                <StatsCards stats={data.stats} config={config} models={[]} onlyCards />
              </div>
            </div>
            {/* 右侧：模型状态与近期活动，底部对齐 */}
            <div className="flex flex-col gap-4 flex-[3] min-w-0 h-full justify-between">
              <div className="flex flex-col gap-4 h-full justify-between flex-1">
                {config.showModels && <StatsCards stats={data.stats} config={config} models={data.models} onlyModel />}
                {config.showActivity && <RecentActivity activities={data.recentActivities} />}
              </div>
            </div>
          </div>
          {/* 下半部分：用量趋势图表 */}
          {config.showChart && (
            <div className="flex-1 min-h-[320px]">
              <UsageChart data={data.chartData} />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">系统仪表盘</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">今日</SelectItem>
              <SelectItem value="7d">近 7 天</SelectItem>
              <SelectItem value="30d">近 30 天</SelectItem>
              <SelectItem value="90d">近 90 天</SelectItem>
            </SelectContent>
          </Select>
          <ConfigModal config={config} setConfig={setConfig}>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </ConfigModal>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}