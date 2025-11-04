"use client";

import { useState } from "react";
import { Yarn, YarnWeight } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YarnInputProps {
  yarns: Omit<Yarn, 'id' | 'project_id'>[];
  onChange: (yarns: Omit<Yarn, 'id' | 'project_id'>[]) => void;
}

const yarnWeights: YarnWeight[] = [
  'lace', 'fingering', 'sport', 'dk', 'worsted', 'aran', 'bulky', 'super-bulky', 'jumbo'
];

export function YarnInput({ yarns, onChange }: YarnInputProps) {
  const addYarn = () => {
    onChange([
      ...yarns,
      {
        brand: '',
        colorway: '',
        weight: '',
        fiber_content: '',
        yardage: 0,
        notes: '',
      },
    ]);
  };

  const updateYarn = (index: number, field: keyof Omit<Yarn, 'id' | 'project_id'>, value: any) => {
    const updated = [...yarns];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeYarn = (index: number) => {
    onChange(yarns.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Yarn</h3>
        <Button type="button" onClick={addYarn} variant="outline" size="sm">
          + Add Yarn
        </Button>
      </div>

      {yarns.length === 0 && (
        <p className="text-sm text-muted-foreground">No yarn added yet. Click "Add Yarn" to get started.</p>
      )}

      {yarns.map((yarn, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Yarn {index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeYarn(index)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`yarn-brand-${index}`}>Brand</Label>
                <Input
                  id={`yarn-brand-${index}`}
                  value={yarn.brand}
                  onChange={(e) => updateYarn(index, 'brand', e.target.value)}
                  placeholder="e.g., Malabrigo"
                />
              </div>
              <div>
                <Label htmlFor={`yarn-colorway-${index}`}>Colorway</Label>
                <Input
                  id={`yarn-colorway-${index}`}
                  value={yarn.colorway}
                  onChange={(e) => updateYarn(index, 'colorway', e.target.value)}
                  placeholder="e.g., Teal Feather"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`yarn-weight-${index}`}>Weight</Label>
                <Select
                  value={yarn.weight}
                  onValueChange={(value) => updateYarn(index, 'weight', value)}
                >
                  <SelectTrigger id={`yarn-weight-${index}`}>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {yarnWeights.map((weight) => (
                      <SelectItem key={weight} value={weight}>
                        {weight.charAt(0).toUpperCase() + weight.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`yarn-yardage-${index}`}>Yardage</Label>
                <Input
                  id={`yarn-yardage-${index}`}
                  type="number"
                  value={yarn.yardage || ''}
                  onChange={(e) => updateYarn(index, 'yardage', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`yarn-fiber-${index}`}>Fiber Content</Label>
              <Input
                id={`yarn-fiber-${index}`}
                value={yarn.fiber_content}
                onChange={(e) => updateYarn(index, 'fiber_content', e.target.value)}
                placeholder="e.g., 100% Merino Wool"
              />
            </div>

            <div>
              <Label htmlFor={`yarn-notes-${index}`}>Notes</Label>
              <Textarea
                id={`yarn-notes-${index}`}
                value={yarn.notes || ''}
                onChange={(e) => updateYarn(index, 'notes', e.target.value)}
                placeholder="Any additional notes about this yarn..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

