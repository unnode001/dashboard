// src/app/(dashboard)/dashboard/logs/components/log-detail-view.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function LogDetailView({ log, isOpen, setIsOpen }) {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Log Details: {log.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {Object.entries(log).map(([key, value]) => (
            key !== 'prompt' && key !== 'response' && (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <p className="col-span-1 text-sm font-semibold capitalize">{key}</p>
                <p className="col-span-3 text-sm">{typeof value === 'object' ? JSON.stringify(value) : value.toString()}</p>
              </div>
            )
          ))}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Prompt</p>
            <pre className="w-full bg-muted p-3 rounded-md text-sm whitespace-pre-wrap font-mono">{log.prompt}</pre>
          </div>
           <div className="space-y-2">
            <p className="text-sm font-semibold">Response</p>
            <pre className="w-full bg-muted p-3 rounded-md text-sm whitespace-pre-wrap font-mono">{log.response}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}