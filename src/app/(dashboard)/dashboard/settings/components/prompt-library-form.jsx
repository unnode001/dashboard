// src/app/(dashboard)/dashboard/settings/components/prompt-library-form.jsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

export default function PromptLibraryForm({ prompt, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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
                <Label htmlFor="prompt-content">内容</Label>
                <Textarea
                    id="prompt-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="你是一位资深的Python开发专家..."
                    className="h-32"
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    取消
                </Button>
                <Button type="submit">保存</Button>
            </div>
        </form>
    );
}