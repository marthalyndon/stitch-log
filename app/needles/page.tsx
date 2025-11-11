"use client";

import { useEffect, useState } from "react";
import { NeedleInventory, NeedleType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle } from "lucide-react";
import { LoadingPage } from "@/components/loading";

const needleTypes: { value: NeedleType; label: string }[] = [
  { value: 'circular', label: 'Circular' },
  { value: 'straight', label: 'Straight' },
  { value: 'dpn', label: 'DPN' },
  { value: 'interchangeable', label: 'Interchangeable' },
];

export default function NeedlesPage() {
  const [needles, setNeedles] = useState<NeedleInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newNeedle, setNewNeedle] = useState({
    size: '',
    type: 'circular' as NeedleType,
    length: '',
  });

  useEffect(() => {
    fetchNeedles();
  }, []);

  const fetchNeedles = async () => {
    try {
      const response = await fetch('/api/needle-inventory');
      if (response.ok) {
        const data = await response.json();
        setNeedles(data);
      }
    } catch (error) {
      console.error('Error fetching needles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNeedle = async () => {
    if (!newNeedle.size || !newNeedle.type) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/needle-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNeedle),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add needle:', errorData);
        throw new Error(errorData.error || 'Failed to add needle');
      }

      setNewNeedle({ size: '', type: 'circular', length: '' });
      setShowDialog(false);
      fetchNeedles();
    } catch (error) {
      console.error('Error adding needle:', error);
      alert('Failed to add needle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNeedle = async (id: string) => {
    if (!confirm('Delete this needle from your inventory?')) return;

    try {
      const response = await fetch(`/api/needle-inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete needle');

      fetchNeedles();
    } catch (error) {
      console.error('Error deleting needle:', error);
      alert('Failed to delete needle. Please try again.');
    }
  };

  // Group needles by type
  const needlesByType = needles.reduce((acc, needle) => {
    if (!acc[needle.type]) {
      acc[needle.type] = [];
    }
    acc[needle.type].push(needle);
    return acc;
  }, {} as Record<NeedleType, NeedleInventory[]>);

  if (loading) {
    return <LoadingPage message="Loading needle inventory..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Needles</h1>
          <p className="text-muted-foreground">Manage your needle collection</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Needle
        </Button>
      </div>

      {needles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="mb-4">No needles in your inventory yet.</p>
            <Button onClick={() => setShowDialog(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Your First Needle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {needleTypes.map((typeInfo) => {
            const typeNeedles = needlesByType[typeInfo.value] || [];
            if (typeNeedles.length === 0) return null;

            return (
              <Card key={typeInfo.value}>
                <CardHeader>
                  <CardTitle className="text-lg">{typeInfo.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {typeNeedles.map((needle) => (
                      <div
                        key={needle.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <span className="font-semibold">US {needle.size}</span>
                          {needle.length && (
                            <span className="text-sm text-muted-foreground ml-2">
                              ({needle.length})
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNeedle(needle.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Needle Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Needle to Inventory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="needle-type">Type *</Label>
              <Select
                value={newNeedle.type}
                onValueChange={(value: NeedleType) =>
                  setNewNeedle({ ...newNeedle, type: value })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {needleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="needle-size">Size (US) *</Label>
              <Input
                id="needle-size"
                value={newNeedle.size}
                onChange={(e) =>
                  setNewNeedle({ ...newNeedle, size: e.target.value })
                }
                placeholder="e.g. 7, 2.5"
                className="bg-white"
              />
            </div>

            <div>
              <Label htmlFor="needle-length">Length (optional)</Label>
              <Input
                id="needle-length"
                value={newNeedle.length}
                onChange={(e) =>
                  setNewNeedle({ ...newNeedle, length: e.target.value })
                }
                placeholder="e.g. 32 inch, 16 inch"
                className="bg-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddNeedle}
              disabled={isSubmitting || !newNeedle.size || !newNeedle.type}
            >
              {isSubmitting ? 'Adding...' : 'Add Needle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

