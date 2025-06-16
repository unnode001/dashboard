// src/app/(dashboard)/dashboard/settings/components/prompt-library-form.jsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// 动态导入我们新的Markdown编辑器
const MarkdownEditor = dynamic(() => import('./markdown-editor'), { ssr: false });

export default function PromptLibraryForm({ prompt, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // content 现在将存储Markdown字符串

    useEffect(() => {
        if (prompt) {
            setTitle(prompt.title);
            setContent(prompt.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [prompt]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('标题和内容不能为空。');
            return;
        }
        onSave({ title, content });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="prompt-title">标题</Label>
                <Input
                    id="prompt-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：Python专家"
                />
            </div>
            <div>
                <Label>内容 (支持Markdown)</Label>
                <MarkdownEditor value={content} onChange={setContent} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    取消
                </Button>
                <Button type="submit">保存</Button>
            </div>
        </form>
    );
}