"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  availableTags?: Tag[];
}

export function TagInput({ selectedTags, onChange, availableTags = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue.trim() && availableTags.length > 0) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag.name)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      if (suggestions.length > 0) {
        setSuggestions([]);
      }
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, availableTags]);

  const addTag = (tagName: string) => {
    const trimmed = tagName.trim().toLowerCase();
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagName: string) => {
    onChange(selectedTags.filter((t) => t !== tagName));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addTag(suggestions[0].name);
      } else {
        addTag(inputValue);
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="tag-input">Tags</Label>
      <div className="relative">
        <Input
          id="tag-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (press Enter)"
        />
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag.name)}
                className="w-full px-3 py-2 text-left hover:bg-accent transition-colors"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-auto p-1 ml-1 hover:bg-transparent"
              >
                ×
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

