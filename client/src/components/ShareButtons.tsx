'use client';

import { Share2, Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mr-1">
        <Share2 className="w-3.5 h-3.5" /> షేర్:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white hover:bg-green-600"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-500 text-white hover:bg-sky-600"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className={`share-btn inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
          copied
            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>
      {copied && (
        <span className="text-xs text-green-600 dark:text-green-400 font-medium animate-pulse">
          కాపీ చేయబడింది!
        </span>
      )}
    </div>
  );
}
