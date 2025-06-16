// src/app/(dashboard)/dashboard/console/components/settings-panel.jsx
'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPanel({ settings, setSettings, isLoading }) {
  return (
    <div className="p-4 border-l bg-background h-full">
      <h3 className="text-lg font-semibold mb-4">参数配置</h3>
      <div className="space-y-6">
        <div>
          <Label htmlFor="model">模型</Label>
          <Select
            value={settings.model}
            onValueChange={(value) => setSettings(s => ({ ...s, model: value }))}
            disabled={isLoading}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder="选择一个模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="temperature">温度: {settings.temperature}</Label>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[settings.temperature]}
            onValueChange={([value]) => setSettings(s => ({ ...s, temperature: value }))}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="max-tokens">最大Token: {settings.maxTokens}</Label>
          <Slider
            id="max-tokens"
            min={100}
            max={4000}
            step={100}
            value={[settings.maxTokens]}
            onValueChange={([value]) => setSettings(s => ({ ...s, maxTokens: value }))}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="system-prompt">系统提示</Label>
          <Textarea
            id="system-prompt"
            placeholder="例如: 你是一个乐于助人的AI助手。"
            value={settings.systemPrompt}
            onChange={(e) => setSettings(s => ({ ...s, systemPrompt: e.target.value }))}
            disabled={isLoading}
            className="h-32"
          />
        </div>
      </div>
    </div>
  );
}