"use client";

import { useState } from "react";
import { Pattern } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PatternInputProps {
  pattern: Omit<Pattern, 'id' | 'project_id'> | null;
  onChange: (pattern: Omit<Pattern, 'id' | 'project_id'> | null) => void;
}

export function PatternInput({ pattern, onChange }: PatternInputProps) {
  const [isScrapingUrl, setIsScrapingUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!isScrapingUrl) return;
    
    setIsScraping(true);
    setScrapeError(null);
    
    try {
      const response = await fetch('/api/ravelry/pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: isScrapingUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pattern');
      }

      const scrapedData = await response.json();
      onChange({
        name: scrapedData.name || '',
        source_url: isScrapingUrl,
        designer: scrapedData.designer || '',
        scraped_data: scrapedData.scraped_data || {},
      });
      setIsScrapingUrl('');
    } catch (error) {
      setScrapeError(error instanceof Error ? error.message : 'Failed to import pattern');
    } finally {
      setIsScraping(false);
    }
  };

  const updatePattern = (field: keyof Omit<Pattern, 'id' | 'project_id'>, value: any) => {
    if (!pattern) {
      onChange({
        name: '',
        source_url: '',
        designer: '',
        scraped_data: {},
        [field]: value,
      });
    } else {
      onChange({ ...pattern, [field]: value });
    }
  };

  const clearPattern = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold">Pattern</h3>
        {pattern && (
          <Button type="button" variant="ghost" size="sm" onClick={clearPattern}>
            Clear Pattern
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Import from Ravelry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="ravelry-url">Ravelry Pattern URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="ravelry-url"
                value={isScrapingUrl}
                onChange={(e) => setIsScrapingUrl(e.target.value)}
                placeholder="https://www.ravelry.com/patterns/library/..."
                disabled={isScraping}
              />
              <Button
                type="button"
                onClick={handleScrape}
                disabled={!isScrapingUrl || isScraping}
              >
                {isScraping ? 'Importing...' : 'Import'}
              </Button>
            </div>
            {scrapeError && (
              <p className="text-sm text-destructive mt-2">{scrapeError}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Need API access? See <a href="/RAVELRY_API_SETUP.md" target="_blank" className="underline">setup guide</a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pattern Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pattern-name">Pattern Name</Label>
            <Input
              id="pattern-name"
              value={pattern?.name || ''}
              onChange={(e) => updatePattern('name', e.target.value)}
              placeholder="e.g., Cozy Cabled Sweater"
            />
          </div>

          <div>
            <Label htmlFor="pattern-designer">Designer</Label>
            <Input
              id="pattern-designer"
              value={pattern?.designer || ''}
              onChange={(e) => updatePattern('designer', e.target.value)}
              placeholder="e.g., Jane Doe"
            />
          </div>

          <div>
            <Label htmlFor="pattern-url">Pattern URL</Label>
            <Input
              id="pattern-url"
              value={pattern?.source_url || ''}
              onChange={(e) => updatePattern('source_url', e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

