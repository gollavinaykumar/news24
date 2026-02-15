import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export default function AdPlaceholder({ slotId, format = 'auto', className = '', label = 'Advertisement' }: AdPlaceholderProps) {
  // In production, replace this with actual AdSense code or Script
  return (
    <div className={`bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs uppercase tracking-widest p-4 my-4 ${className}`}>
      <span className="mb-2">{label}</span>
      <div className="w-full h-full min-h-[100px] bg-gray-200 animate-pulse rounded"></div>
      {/* 
        Actual AdSense:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
    </div>
  );
}
