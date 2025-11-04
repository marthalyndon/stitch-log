"use client";

import { useState } from "react";
import { ProjectWithDetails, ProjectStatus, Yarn, Needle, Pattern } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { YarnInput } from "./yarn-input";
import { NeedleInput } from "./needle-input";
import { TagInput } from "./tag-input";
import { PatternInput } from "./pattern-input";

interface ProjectFormProps {
  initialData?: ProjectWithDetails;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  pattern: Omit<Pattern, 'id' | 'project_id'> | null;
  yarns: Omit<Yarn, 'id' | 'project_id'>[];
  needles: Omit<Needle, 'id' | 'project_id'>[];
  tags: string[];
}

export function ProjectForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'idea',
    pattern: initialData?.patterns?.[0] ? {
      name: initialData.patterns[0].name,
      source_url: initialData.patterns[0].source_url,
      designer: initialData.patterns[0].designer,
      scraped_data: initialData.patterns[0].scraped_data,
    } : null,
    yarns: initialData?.yarns?.map(y => ({
      brand: y.brand,
      colorway: y.colorway,
      weight: y.weight,
      fiber_content: y.fiber_content,
      yardage: y.yardage,
      notes: y.notes,
    })) || [],
    needles: initialData?.needles?.map(n => ({
      size: n.size,
      type: n.type,
      length: n.length,
    })) || [],
    tags: initialData?.tags?.map(t => t.name) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mom's Birthday Sweater"
              required
            />
          </div>

          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about this project..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
            >
              <SelectTrigger id="project-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <PatternInput
        pattern={formData.pattern}
        onChange={(pattern) => setFormData({ ...formData, pattern })}
      />

      <YarnInput
        yarns={formData.yarns}
        onChange={(yarns) => setFormData({ ...formData, yarns })}
      />

      <NeedleInput
        needles={formData.needles}
        onChange={(needles) => setFormData({ ...formData, needles })}
      />

      <Card>
        <CardContent className="pt-6">
          <TagInput
            selectedTags={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.name}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

