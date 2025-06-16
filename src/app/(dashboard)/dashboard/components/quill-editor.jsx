'use client';

// 使用 'use client' 告诉Next.js这是一个客户端组件

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 导入编辑器的 "Snow" 主题样式

// 配置编辑器的工具栏，可以按需增删
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'code-block'], // 包含链接和代码块功能
        ['clean']
    ],
};

// 定义编辑器支持的格式
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'code-block'
];

/**
 * 这是一个ReactQuill编辑器的封装组件
 * @param {string} value - 编辑器的内容 (HTML字符串)
 * @param {function} onChange - 内容变化时的回调函数
 */
export default function QuillEditor({ value, onChange }) {
    return (
        <div className="bg-background text-foreground">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
            />
        </div>
    );
}
