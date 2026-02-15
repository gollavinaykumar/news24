'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '@/lib/api';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagsInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ selectedTags, onChange }: TagsInputProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags');
      setAvailableTags(res.data);
    } catch (error) {
      console.error('Failed to load tags');
    }
  };

  const handleAddTag = async (tagName: string) => {
    // Check if tag exists in available tags
    const existingTag = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    
    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        onChange([...selectedTags, existingTag.id]);
      }
    } else {
      // Create new tag
      // For now, let's just create it on the fly or maybe we should only allow existing?
      // The requirement says "Admin can add/edit tags". Let's assume on-the-fly creation for smoother UX.
      try {
        const res = await api.post('/tags', { name: tagName });
        const newTag = res.data;
        setAvailableTags([...availableTags, newTag]);
        onChange([...selectedTags, newTag.id]);
      } catch (error) {
        console.error('Failed to create tag');
      }
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const filteredSuggestions = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) && 
    !selectedTags.includes(tag.id)
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          if (!tag) return null;
          return (
            <span key={tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ml-1.5 inline-flex items-center justification-center text-indigo-400 hover:text-indigo-600 focus:outline-none"
              >
                <X size={14} />
              </button>
            </span>
          );
        })}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (inputValue.trim()) handleAddTag(inputValue.trim());
            }
          }}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white p-2 border"
          placeholder="Type to add tags..."
        />
        {showSuggestions && inputValue && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleAddTag(tag.name)}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                >
                  {tag.name}
                </div>
              ))
            ) : (
                <div
                  onClick={() => handleAddTag(inputValue)}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                >
                  Create "{inputValue}"
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
