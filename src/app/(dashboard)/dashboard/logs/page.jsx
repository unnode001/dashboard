'use client';

import axios from 'axios';
import { Download } from 'lucide-react';
import Papa from 'papaparse';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { DateRangePicker } from './components/date-range-picker';
import LogDetailView from './components/log-detail-view';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(undefined);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // 排序状态 (默认按时间戳降序)
  const [sorting, setSorting] = useState({ id: 'timestamp', desc: true });

  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        query: debouncedSearchQuery,
        sortBy: sorting.id,
        sortOrder: sorting.desc ? 'desc' : 'asc',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (dateRange?.from) {
        params.append('startDate', dateRange.from.toISOString());
        // 如果没有结束日期，则默认结束日期为开始日期
        params.append('endDate', (dateRange.to || dateRange.from).toISOString());
      }

      const response = await axios.get(`/api/logs?${params.toString()}`);
      setLogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      // 可以在这里设置一个错误状态以在UI中显示
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchQuery, statusFilter, dateRange, sorting]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 当筛选或排序条件改变时，重置到第一页
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery, statusFilter, dateRange, sorting]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setIsDetailViewOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        query: debouncedSearchQuery,
        sortBy: sorting.id,
        sortOrder: sorting.desc ? 'desc' : 'asc',
        export: 'true',
      });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateRange?.from) {
        params.append('startDate', dateRange.from.toISOString());
        params.append('endDate', (dateRange.to || dateRange.from).toISOString());
      }

      const response = await axios.get(`/api/logs?${params.toString()}`);
      const allData = response.data.data;

      // 扁平化数据以便导出
      const flatData = allData.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        status: log.status,
        user: log.user,
        model: log.model,
        latency_ms: log.latency,
        cost_usd: log.cost,
        prompt_tokens: log.tokens.prompt,
        completion_tokens: log.tokens.completion,
        total_tokens: log.tokens.total,
        prompt: log.prompt,
        response: log.response,
      }));

      if (flatData.length === 0) {
        alert("没有可导出的数据。");
        return;
      }

      const csv = Papa.unparse(flatData);
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }); // 添加BOM头以兼容Excel
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `logs-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Failed to export data:", error);
      alert("导出失败，请检查控制台日志。");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">系统日志</h1>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <Input
          placeholder="搜索用户或Prompt..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          disabled={loading}
        />
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} disabled={loading} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loading} className="w-[120px]">
                状态: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={statusFilter === 'all'} onCheckedChange={() => setStatusFilter('all')}>All</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === 'success'} onCheckedChange={() => setStatusFilter('success')}>Success</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === 'failed'} onCheckedChange={() => setStatusFilter('failed')}>Failed</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleExport} disabled={isExporting || loading}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "导出中..." : "导出CSV"}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns(handleRowClick)}
        data={logs}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
        isLoading={loading}
        sorting={sorting}
        setSorting={setSorting}
      />

      <LogDetailView log={selectedLog} isOpen={isDetailViewOpen} setIsOpen={setIsDetailViewOpen} />
    </div>
  );
}
