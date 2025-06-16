// src/app/(dashboard)/dashboard/settings/page.jsx
'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 安装: npm install uuid
import ApiKeyForm from './components/api-key-form';
import PromptLibraryForm from './components/prompt-library-form';

const LOCAL_STORAGE_KEYS = {
  API_KEYS: 'apiKeys',
  THEME: 'theme',
  CHAT_SESSIONS: 'chatSessions',
  DASHBOARD_CONFIG: 'dashboardConfig',
  PROMPT_LIBRARY: 'promptLibrary', // 新增
};

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [theme, setTheme] = useState('system');
  const [promptLibrary, setPromptLibrary] = useState([]);
  const [editingPrompt, setEditingPrompt] = useState(null); // null: 不在编辑, 'new': 新建, object: 编辑现有
  const [isPromptFormOpen, setIsPromptFormOpen] = useState(false);
  const importFileRef = useRef(null); // 用于触发文件选择

  // --- 数据加载与持久化 ---
  useEffect(() => {
    // 主题加载
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) || 'system';
    handleThemeChange(savedTheme, false); // 加载但不重复保存

    // API密钥加载
    const savedApiKeys = localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEYS);
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }

    // 新增：加载提示词库
    const savedPrompts = localStorage.getItem(LOCAL_STORAGE_KEYS.PROMPT_LIBRARY);
    if (savedPrompts) {
      setPromptLibrary(JSON.parse(savedPrompts));
    }
  }, []);

  // 当apiKeys状态变化时，自动保存到localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.API_KEYS, JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROMPT_LIBRARY, JSON.stringify(promptLibrary));
  }, [promptLibrary]);

  // --- 事件处理器 ---
  const handleSaveKey = (data) => {
    const newKey = {
      id: uuidv4(),
      service: data.service,
      key: `${data.key.substring(0, 5)}...${data.key.substring(data.key.length - 4)}`,
      // 存储完整的密钥以便导出，但在UI上不显示
      _fullKey: data.key,
      createdAt: new Date().toISOString(),
    };
    setApiKeys(prev => [...prev, newKey]);
    setIsFormOpen(false);
  };

  const handleDeleteKey = (id) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const handleThemeChange = (newTheme, save = true) => {
    setTheme(newTheme);
    if (save) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
    }
    document.documentElement.classList.remove('light', 'dark');
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(newTheme);
    }
  };

  const handleClearData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CHAT_SESSIONS);
    alert('所有本地存储的会话历史已被清除。');
  };

  // 新增：导出设置
  const handleExport = () => {
    try {
      const settingsToExport = {};
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          // 尝试解析为 JSON，失败则直接存原始字符串
          let parsed;
          try {
            parsed = JSON.parse(value);
          } catch {
            parsed = value;
          }
          settingsToExport[key] = parsed;
        }
      });

      const blob = new Blob([JSON.stringify(settingsToExport, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ai-platform-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("导出失败:", e);
      alert("导出设置失败，请检查控制台。");
    }
  };

  // 新增：导入设置
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        let settingsApplied = false;

        Object.entries(importedSettings).forEach(([key, value]) => {
          if (Object.values(LOCAL_STORAGE_KEYS).includes(key)) {
            localStorage.setItem(key, JSON.stringify(value));
            settingsApplied = true;
          }
        });

        if (settingsApplied) {
          alert("设置已成功导入！建议刷新页面以确保所有设置完全生效。");
          // 强制重新加载以应用所有设置
          window.location.reload();
        } else {
          alert("文件中未找到有效的设置项。");
        }
      } catch (error) {
        console.error("导入失败:", error);
        alert("导入失败，文件格式可能不正确。");
      }
    };
    reader.readAsText(file);
    // 重置input，以便可以再次上传同名文件
    event.target.value = '';
  };

  // 优化：打开新建提示词表单
  const handleAddNewPrompt = () => {
    setEditingPrompt('new');
    setIsPromptFormOpen(true);
  };

  // 优化：打开编辑提示词表单
  const handleEditPrompt = (prompt) => {
    setEditingPrompt(prompt);
    setIsPromptFormOpen(true);
  };

  const handleSavePrompt = ({ title, content }) => {
    if (editingPrompt === 'new') {
      setPromptLibrary(prev => [...prev, { id: uuidv4(), title, content }]);
    } else {
      setPromptLibrary(prev => prev.map(p => p.id === editingPrompt.id ? { ...p, title, content } : p));
    }
    setIsPromptFormOpen(false);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (id) => {
    if (window.confirm('您确定要删除这个提示词吗？')) {
      setPromptLibrary(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>
      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList>
          <TabsTrigger value="api-keys">API密钥</TabsTrigger>
          <TabsTrigger value="general">通用</TabsTrigger>
          <TabsTrigger value="appearance">外观</TabsTrigger>
          <TabsTrigger value="data">数据管理</TabsTrigger>
          <TabsTrigger value="prompts">提示词库</TabsTrigger>
        </TabsList>

        {/* API密钥 Tab */}
        <TabsContent value="api-keys" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">管理您的API密钥</h3>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>添加新密钥</Button>
              </DialogTrigger>
              <ApiKeyForm onSave={handleSaveKey} onCancel={() => setIsFormOpen(false)} />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>服务</TableHead>
                  <TableHead>部分密钥</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map(key => (
                  <TableRow key={key.id}>
                    <TableCell>{key.service}</TableCell>
                    <TableCell className="font-mono">{key.key}</TableCell>
                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(key.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 通用设置 Tab */}
        <TabsContent value="general" className="mt-6">
          <div className="space-y-6 max-w-md">
            <h3 className="text-xl font-semibold">默认设置</h3>
            <div>
              <Label>新对话的默认模型</Label>
              <Select defaultValue="gpt-4o">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        {/* 外观设置 Tab */}
        <TabsContent value="appearance" className="mt-6">
          <div className="space-y-6 max-w-md">
            <h3 className="text-xl font-semibold">主题</h3>
            <RadioGroup value={theme} onValueChange={handleThemeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">浅色</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">深色</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">跟随系统</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>

        {/* 数据管理 Tab (更新后) */}
        <TabsContent value="data" className="mt-6">
          <div className="space-y-6 max-w-lg">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">备份与迁移</h3>
              <p className="text-sm text-muted-foreground mb-4">
                您可以将所有设置（包括API密钥和会话历史）导出为一个文件进行备份，或在另一台设备上导入它。
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  导出设置
                </Button>
                <Button variant="outline" onClick={() => importFileRef.current.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  导入设置
                </Button>
                <input
                  type="file"
                  ref={importFileRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleImport}
                />
              </div>
            </div>

            <div className="p-4 border border-destructive rounded-lg">
              <h3 className="text-xl font-semibold text-destructive">危险区域</h3>
              <p className="text-sm text-muted-foreground mb-4">
                以下操作是不可逆的。请谨慎操作。
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">清除所有本地会话历史</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>您确定吗？</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作将永久删除您在“控制台”模块中的所有对话历史记录。此数据无法恢复。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData}>继续清除</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>

        {/* 新增：提示词库 Tab */}
        <TabsContent value="prompts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>管理您的系统提示词</CardTitle>
              <Button onClick={handleAddNewPrompt}><Plus className="mr-2 h-4 w-4" />添加新提示</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promptLibrary.map(prompt => (
                  <div key={prompt.id} className="p-4 border rounded-lg flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{prompt.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{prompt.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPrompt(prompt)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePrompt(prompt.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                {promptLibrary.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">您的提示词库是空的。请添加一个新提示！</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 优化：将表单移动到 Dialog 组件中 */}
      <Dialog open={isPromptFormOpen} onOpenChange={setIsPromptFormOpen}>
        <DialogContent>
          <DialogTitle>{editingPrompt === 'new' ? '新建提示词' : '编辑提示词'}</DialogTitle>
          <PromptLibraryForm
            prompt={editingPrompt === 'new' ? null : editingPrompt}
            onSave={handleSavePrompt}
            onCancel={() => { setIsPromptFormOpen(false); setEditingPrompt(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}