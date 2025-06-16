// src/app/(dashboard)/dashboard/settings/components/api-key-form.jsx
'use client';
import { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ApiKeyForm({ onSave, onCancel }) {
  const [service, setService] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service.trim() || !key.trim()) {
      setError('服务名称和密钥不能为空。');
      return;
    }
    setError('');
    onSave({ service, key });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>添加新的API密钥</DialogTitle>
        <DialogDescription>
          将您的API密钥安全地保存在此。密钥将仅存储在您的浏览器中。
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div>
          <Label htmlFor="service">服务名称 (例如: OpenAI)</Label>
          <Input
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="OpenAI"
          />
        </div>
        <div>
          <Label htmlFor="key">API密钥</Label>
          <Input
            id="key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
          <Button type="submit">保存密钥</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}