'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

async function getTagSuggestions(input: string, excludeTags: string[] = []) {
  const supabase = await createClient();

  const excludeStr = `(${excludeTags.map(tag => `${tag}`).join(',')})`;

  const { data, error } = await supabase
    .from('tags')
    .select('name')
    .ilike('name', `%${input}%`)
    .not('name', 'in', excludeStr)
    .limit(10);

  if (error) {
    console.error('Error fetching tag suggestions:', error);
    return [];
  }

  return data?.map(tag => tag.name) || [];
}

export default function TagPicker({
  currentTags,
  onTagSelect,
}: {
  currentTags: string[];
  onTagSelect: (tag: string) => void;
}) {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    if (value.length === 0) {
      setTagSuggestions([]);
      return;
    }

    timeoutId.current = setTimeout(() => {
      getTagSuggestions(value, currentTags).then(tagsSuggestions => {
        setTagSuggestions([value, ...tagsSuggestions]);
      });
    }, 300);
  };

  const handleTagClick = (tag: string) => {
    onTagSelect(tag);
    setTagSuggestions([]);
    if (tagInputRef.current) {
      tagInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="focus:ring-accent-4 border-secondary h-[61px] w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none"
        onChange={handleTagInputChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        ref={tagInputRef}
      />
      {tagSuggestions.length > 0 && isInputFocused && (
        <div className="divide-secondary/50 border-secondary bg-background absolute top-full left-0 z-40 mt-1 max-h-[250px] w-full divide-y overflow-y-auto rounded-md border shadow-lg">
          {tagSuggestions.map(tag => (
            <div
              key={tag}
              className="hover:bg-secondary/30 cursor-pointer px-3 py-5"
              onMouseDown={() => handleTagClick(tag)}
              onTouchStart={() => handleTagClick(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
