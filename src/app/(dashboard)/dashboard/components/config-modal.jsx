// src/app/(dashboard)/dashboard/components/config-modal.jsx
// ... (imports remain the same)
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function ConfigModal({ children, config, setConfig }) {
  // ... (handleCheckedChange remains the same)
  const handleCheckedChange = (key, checked) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [key]: checked,
    }));
  };

  const handleSelectChange = (value) => {
    setConfig(prev => ({ ...prev, refreshInterval: Number(value) }));
  }


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>仪表盘配置</DialogTitle>
          <DialogDescription>
            自定义您想在仪表盘上看到的信息卡片。更改将自动保存。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* ... (other checkboxes) ... */}
          <div className="items-center flex gap-4">
            <Checkbox
              id="showCost"
              checked={!!config.showCost}
              onCheckedChange={(checked) => handleCheckedChange('showCost', checked)}
            />
            <Label htmlFor="showCost" className="text-base">
              显示成本分析卡片
            </Label>
          </div>
          <div className="items-center flex gap-4">
            <Checkbox
              id="showModels"
              checked={!!config.showModels}
              onCheckedChange={(checked) => handleCheckedChange('showModels', checked)}
            />
            <Label htmlFor="showModels" className="text-base">
              显示模型状态卡片
            </Label>
          </div>
          <div className="items-center flex gap-4">
            <Checkbox
              id="showChart"
              checked={!!config.showChart}
              onCheckedChange={(checked) => handleCheckedChange('showChart', checked)}
            />
            <Label htmlFor="showChart" className="text-base">
              显示用量趋势图表
            </Label>
          </div>
          {/* 新增的 Checkbox */}
          <div className="items-center flex gap-4">
            <Checkbox
              id="showActivity"
              checked={!!config.showActivity}
              onCheckedChange={(checked) => handleCheckedChange('showActivity', checked)}
            />
            <Label htmlFor="showActivity" className="text-base">
              显示近期活动日志
            </Label>
            <div className="space-y-2">
              <Label htmlFor="refreshInterval" className="text-base">
                自动刷新频率
              </Label>

              <Select
                value={String(config.refreshInterval)}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="refreshInterval">
                  <SelectValue placeholder="选择刷新频率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">关闭</SelectItem>
                  <SelectItem value="30000">每 30 秒</SelectItem>
                  <SelectItem value="60000">每 1 分钟</SelectItem>
                  <SelectItem value="300000">每 5 分钟</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">完成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}