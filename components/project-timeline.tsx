"use client";

import { useState } from "react";
import { Note } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { PlusCircle, Trash2, Edit2, X, ImagePlus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProjectTimelineProps {
  projectId: string;
  notes: Note[];
  onUpdate: () => void;
  onPhotoUpload: (file: File) => Promise<string>;
}

export function ProjectTimeline({
  projectId,
  notes,
  onUpdate,
  onPhotoUpload,
}: ProjectTimelineProps) {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePhotos, setNewNotePhotos] = useState<File[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [editNotePhotos, setEditNotePhotos] = useState<File[]>([]);
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort notes by created date
  const timeline = notes.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      // Upload photos first if any
      const uploadedPhotoUrls: string[] = [];
      for (const file of newNotePhotos) {
        const url = await onPhotoUpload(file);
        uploadedPhotoUrls.push(url);
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          content: newNoteContent,
          photoUrls: uploadedPhotoUrls,
        }),
      });

      if (!response.ok) throw new Error('Failed to create note');

      setNewNoteContent('');
      setNewNotePhotos([]);
      setShowNoteDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      // Upload new photos if any
      const uploadedPhotoUrls: string[] = [];
      for (const file of editNotePhotos) {
        const url = await onPhotoUpload(file);
        uploadedPhotoUrls.push(url);
      }

      // Combine existing photo URLs with newly uploaded ones
      const allPhotoUrls = [...existingPhotoUrls, ...uploadedPhotoUrls];

      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editNoteContent,
          photoUrls: allPhotoUrls,
        }),
      });

      if (!response.ok) throw new Error('Failed to update note');

      setEditingNote(null);
      setEditNoteContent('');
      setEditNotePhotos([]);
      setExistingPhotoUrls([]);
      onUpdate();
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      onUpdate();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleAddNotePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewNotePhotos(prev => [...prev, ...files]);
  };

  const handleAddEditPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEditNotePhotos(prev => [...prev, ...files]);
  };

  const removeNewPhoto = (index: number) => {
    setNewNotePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeEditPhoto = (index: number) => {
    setEditNotePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <Button onClick={() => setShowNoteDialog(true)} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Entry
      </Button>

      {timeline.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No timeline entries yet. Add your first entry to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {/* Timeline Entries */}
          <div className="space-y-6">
            {timeline.map((note) => (
              <div key={note.id} className="relative pl-12">
                {/* Timeline Dot & Date */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(note.created_at)}
                  </span>
                </div>
                
                <Card>
                  <CardContent>
                    <div className="flex items-start justify-end mb-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNote(note);
                            setEditNoteContent(note.content);
                            setExistingPhotoUrls(note.photo_urls || []);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm mt-2 prose prose-sm max-w-none prose-headings:font-semibold prose-a:text-primary prose-strong:font-semibold">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {note.content}
                      </ReactMarkdown>
                    </div>
                    
                    {note.photo_urls && note.photo_urls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {note.photo_urls.map((url, idx) => (
                          <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                              src={url}
                              alt={`Photo ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Entry Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note</Label>
              <Textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="What's happening with your project? (You can use markdown: **bold**, *italic*, - lists, etc.)"
                rows={6}
                className="bg-white mt-2"
              />
            </div>
            <div>
              <Label>Photos (optional)</Label>
              <div className="mt-2">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent transition-colors">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to add photos</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddNotePhotos}
                    className="hidden"
                  />
                </label>
                {newNotePhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {newNotePhotos.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeNewPhoto(idx)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowNoteDialog(false);
              setNewNotePhotos([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateNote} disabled={isSubmitting || !newNoteContent.trim()}>
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => {
        setEditingNote(null);
        setEditNotePhotos([]);
        setExistingPhotoUrls([]);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note</Label>
              <Textarea
                value={editNoteContent}
                onChange={(e) => setEditNoteContent(e.target.value)}
                placeholder="You can use markdown: **bold**, *italic*, - lists, etc."
                rows={6}
                className="bg-white mt-2"
              />
            </div>
            <div>
              <Label>Photos</Label>
              <div className="mt-2">
                {/* Existing photos */}
                {existingPhotoUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {existingPhotoUrls.map((url, idx) => (
                      <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={url}
                          alt={`Photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeExistingPhoto(idx)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* New photos to upload */}
                {editNotePhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {editNotePhotos.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeEditPhoto(idx)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add more photos button */}
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent transition-colors">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to add more photos</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddEditPhotos}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingNote(null);
              setEditNotePhotos([]);
              setExistingPhotoUrls([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNote} disabled={isSubmitting || !editNoteContent.trim()}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

