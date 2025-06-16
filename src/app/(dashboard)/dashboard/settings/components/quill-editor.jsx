// src/app/(dashboard)/dashboard/settings/components/quill-editor.jsx
'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function QuillEditor({ value, onChange }) {
    // 工具栏配置
    const modules = useMemo(() => ({
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            ['link'],
            ['clean'],
        ],
    }), []);

    return (
        <div className="bg-background border rounded-md">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className="min-h-[120px]"
            />
        </div>
    );
}
