// src/app/(dashboard)/dashboard/console/components/settings-panel.jsx
'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const PROMPT_LIBRARY_KEY = 'promptLibrary';

export default function SettingsPanel({ settings, setSettings, isLoading }) {
  const [promptLibrary, setPromptLibrary] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const savedPrompts = localStorage.getItem(PROMPT_LIBRARY_KEY);
    if (savedPrompts) {
      setPromptLibrary(JSON.parse(savedPrompts));
    }
  }, []);

  const selectedPromptTitle = promptLibrary.find(p => p.content === settings.systemPrompt)?.title;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">参数配置</h3>
      <div>
        <Label>模型</Label>
        <Select
          value={settings.model}
          onValueChange={(value) => setSettings({ ...settings, model: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
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
        <Label>温度: {settings.temperature}</Label>
        <Slider
          min={0}
          max={2}
          step={0.1}
          value={[settings.temperature]}
          onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label>最大Token: {settings.maxTokens}</Label>
        <Slider
          min={100}
          max={4000}
          step={100}
          value={[settings.maxTokens]}
          onValueChange={([value]) => setSettings({ ...settings, maxTokens: value })}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label>系统提示</Label>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="w-full justify-between font-normal text-left h-auto"
              disabled={isLoading}
            >
              <span className="truncate pr-2">
                {selectedPromptTitle || settings.systemPrompt || "选择一个预设..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="搜索或输入自定义提示..." />
              <Textarea
                placeholder="在此输入自定义系统提示..."
                value={settings.systemPrompt}
                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                className="m-1 w-[calc(100%-0.5rem)]"
              />
              <CommandList>
                <CommandEmpty>没有找到提示。</CommandEmpty>
                <CommandGroup heading="提示词库">
                  {promptLibrary.map((prompt) => (
                    <CommandItem
                      key={prompt.id}
                      value={prompt.title}
                      onSelect={() => {
                        setSettings({ ...settings, systemPrompt: prompt.content });
                        setPopoverOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", settings.systemPrompt === prompt.content ? "opacity-100" : "opacity-0")} />
                      {prompt.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {console.log('settings:', settings)}
    </div>
  );
}