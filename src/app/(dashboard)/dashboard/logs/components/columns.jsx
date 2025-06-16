'use client';

import { Badge } from '@/components/ui/badge';

const StatusBadge = ({ status }) => {
  if (status === 200) {
    return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Success</Badge>;
  }
  if (status === 429) {
    return <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-white">Rate Limit</Badge>;
  }
  return <Badge variant="destructive">Failed</Badge>;
};

export const columns = (onRowClick) => [
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => new Date(row.timestamp).toLocaleString('zh-CN'),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.status} />,
    enableSorting: false, // 状态通常不进行排序
  },
  {
    accessorKey: 'model',
    header: 'Model',
    enableSorting: false,
  },
  {
    accessorKey: 'user',
    header: 'User',
    enableSorting: false,
  },
  {
    accessorKey: 'latency',
    header: 'Latency',
    cell: ({ row }) => `${row.latency}ms`,
    enableSorting: true,
  },
  {
    accessorKey: 'tokens.total',
    header: 'Total Tokens',
    cell: ({ row }) => row.tokens.total,
    enableSorting: true,
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => `$${row.cost}`,
    enableSorting: true,
  },
];
