"use client";

import { Needle, NeedleType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NeedleInputProps {
  needles: Omit<Needle, 'id' | 'project_id'>[];
  onChange: (needles: Omit<Needle, 'id' | 'project_id'>[]) => void;
}

const needleTypes: NeedleType[] = ['circular', 'straight', 'dpn', 'interchangeable'];

export function NeedleInput({ needles, onChange }: NeedleInputProps) {
  const addNeedle = () => {
    onChange([
      ...needles,
      {
        size: '',
        type: 'circular',
        length: '',
      },
    ]);
  };

  const updateNeedle = (index: number, field: keyof Omit<Needle, 'id' | 'project_id'>, value: any) => {
    const updated = [...needles];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeNeedle = (index: number) => {
    onChange(needles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold">Needles</h3>
        <Button type="button" onClick={addNeedle} variant="outline" size="sm">
          + Add Needle
        </Button>
      </div>

      {needles.length === 0 && (
        <p className="text-sm text-muted-foreground">No needles added yet. Click "Add Needle" to get started.</p>
      )}

      {needles.map((needle, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Needle {index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeNeedle(index)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`needle-type-${index}`}>Type</Label>
                <Select
                  value={needle.type}
                  onValueChange={(value) => updateNeedle(index, 'type', value as NeedleType)}
                >
                  <SelectTrigger id={`needle-type-${index}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {needleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`needle-size-${index}`}>Size</Label>
                <Input
                  id={`needle-size-${index}`}
                  value={needle.size}
                  onChange={(e) => updateNeedle(index, 'size', e.target.value)}
                  placeholder="e.g., US 7 / 4.5mm"
                />
              </div>
            </div>

            {(needle.type === 'circular' || needle.type === 'interchangeable') && (
              <div>
                <Label htmlFor={`needle-length-${index}`}>Length</Label>
                <Input
                  id={`needle-length-${index}`}
                  value={needle.length || ''}
                  onChange={(e) => updateNeedle(index, 'length', e.target.value)}
                  placeholder="e.g., 32 inches"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

