'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useCallback } from 'react';
import api from '@/lib/api';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const quillRef = useRef<any>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
           const res = await api.post('/upload', formData, {
             headers: { 'Content-Type': 'multipart/form-data' },
           });
           const url = res.data.url;
           const quill = quillRef.current?.getEditor();
           const range = quill?.getSelection();
           if (quill && range) {
             quill.insertEmbed(range.index, 'image', url);
           }
        } catch (e) {
           console.error('Upload failed', e);
        }
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), [imageHandler]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list',
    'link', 'image'
  ];

  return (
    <div className="bg-white dark:bg-gray-800">
      <style jsx global>{`
        .dark .ql-toolbar {
          background-color: #1f2937;
          border-color: #374151 !important;
          color: #e5e7eb;
        }
        .dark .ql-toolbar .ql-stroke {
          stroke: #e5e7eb !important;
        }
        .dark .ql-toolbar .ql-fill {
          fill: #e5e7eb !important;
        }
        .dark .ql-toolbar .ql-picker {
          color: #e5e7eb !important;
        }
        .dark .ql-container {
          background-color: #111827;
          border-color: #374151 !important;
          color: #f3f4f6 !important;
        }
        .dark .ql-editor.ql-blank::before {
          color: #9ca3af !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <ReactQuill 
        ref={quillRef}
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules} 
        formats={formats} 
        className="h-64 mb-12" // Add margin bottom for toolbar
      />
    </div>
  );
}
