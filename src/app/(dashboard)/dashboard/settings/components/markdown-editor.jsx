'use client';

import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * 一个分栏式的实时预览Markdown编辑器
 * @param {string} value - 编辑器的Markdown内容
 * @param {function} onChange - 内容变化时的回调函数
 */
export default function MarkdownEditor({ value, onChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-2 min-h-[250px] h-[60vh] md:h-[70vh] max-h-[80vh]">
            {/* 输入区域 */}
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="在此输入Markdown格式的提示词...
- 使用列表
- **加粗文本**
- ```js
  // 插入代码块
  console.log('Hello, World!');
  ```"
                className="w-full h-full min-h-[250px] resize-none border-0 focus-visible:ring-0 flex-1"
                style={{ height: '100%', minHeight: 0 }}
            />
            {/* 预览区域 */}
            <div className="bg-muted/50 p-4 rounded-md overflow-y-auto flex-1 min-h-[250px] h-full">
                <h4 className="text-sm font-semibold mb-2 border-b pb-2">预览</h4>
                <div className="prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value || "..."}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
