'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

export function DataTable({
  columns,
  data,
  pagination,
  onPageChange,
  onRowClick,
  isLoading,
  sorting,
  setSorting,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  {column.enableSorting ? (
                    <Button
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => {
                        const isCurrentlyDesc = sorting?.id === column.accessorKey && sorting.desc;
                        setSorting({ id: column.accessorKey, desc: !isCurrentlyDesc });
                      }}
                    >
                      {column.header}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && data.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : data.length ? (
              data.map((row) => (
                <TableRow key={row.id} onClick={() => onRowClick(row)} className="cursor-pointer hover:bg-muted/50">
                  {columns.map((column) => {
                    const value = column.accessorKey.split('.').reduce((o, k) => (o || {})[k], row);
                    return (
                      <TableCell key={column.accessorKey}>
                        {column.cell ? column.cell({ row }) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={isLoading || pagination.page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={isLoading || pagination.page >= pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
