"use client";

import { useEffect, useState } from "react";
import { Needle, NeedleType, NeedleInventory } from "@/lib/types";
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
  const [inventory, setInventory] = useState<NeedleInventory[]>([]);
  const [addMode, setAddMode] = useState<'inventory' | 'custom'>('inventory');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/needle-inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching needle inventory:', error);
    }
  };

  const addNeedleFromInventory = (inventoryNeedle: NeedleInventory) => {
    onChange([
      ...needles,
      {
        size: inventoryNeedle.size,
        type: inventoryNeedle.type,
        length: inventoryNeedle.length || '',
      },
    ]);
  };

  const addCustomNeedle = () => {
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

  // Group inventory by type
  const inventoryByType = inventory.reduce((acc, needle) => {
    if (!acc[needle.type]) {
      acc[needle.type] = [];
    }
    acc[needle.type].push(needle);
    return acc;
  }, {} as Record<NeedleType, NeedleInventory[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Needles</h3>
        {inventory.length > 0 ? (
          <Select value={addMode} onValueChange={(value: 'inventory' | 'custom') => setAddMode(value)}>
            <SelectTrigger className="w-48 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory">From My Needles</SelectItem>
              <SelectItem value="custom">Custom Entry</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {/* Add Needle Section */}
      {inventory.length > 0 && addMode === 'inventory' ? (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Select from Your Needle Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {inventory.map((needle) => (
                <Button
                  key={needle.id}
                  type="button"
                  variant="outline"
                  className="justify-start"
                  onClick={() => addNeedleFromInventory(needle)}
                >
                  <span className="font-semibold">{needle.type.toUpperCase()}</span>
                  <span className="mx-2">•</span>
                  <span>US {needle.size}</span>
                  {needle.length && <span className="ml-2 text-muted-foreground">({needle.length})</span>}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button type="button" onClick={addCustomNeedle} variant="outline" size="sm">
          + Add Needle
        </Button>
      )}

      {needles.length === 0 && (
        <p className="text-sm text-muted-foreground">No needles added yet.</p>
      )}

      {/* Selected Needles */}
      {needles.map((needle, index) => (
        <Card key={index}>
          <CardHeader>
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
                  <SelectTrigger id={`needle-type-${index}`} className="bg-white">
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
                  placeholder="e.g., 7"
                  className="bg-white"
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
                  placeholder="e.g., 32 inch"
                  className="bg-white"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
