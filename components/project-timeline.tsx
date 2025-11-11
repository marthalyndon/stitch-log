"use client";

import { useState } from "react";
import { Photo, Note, PhotoType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PlusCircle, Trash2, Edit2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TimelineEntry {
  id: string;
  type: 'photo' | 'note';
  content: Photo | Note;
  timestamp: string;
}

interface ProjectTimelineProps {
  projectId: string;
  photos: Photo[];
  notes: Note[];
  onUpdate: () => void;
  onPhotoUpload: (file: File, type: PhotoType) => Promise<void>;
  onPhotoDelete: (photoId: string) => Promise<void>;
  isUploading: boolean;
}

export function ProjectTimeline({
  projectId,
  photos,
  notes,
  onUpdate,
  onPhotoUpload,
  onPhotoDelete,
  isUploading,
}: ProjectTimelineProps) {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [selectedPhotoType, setSelectedPhotoType] = useState<PhotoType>('progress');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine photos and notes into a single timeline
  const timeline: TimelineEntry[] = [
    ...photos.map(photo => ({
      id: photo.id,
      type: 'photo' as const,
      content: photo,
      timestamp: photo.uploaded_at,
    })),
    ...notes.map(note => ({
      id: note.id,
      type: 'note' as const,
      content: note,
      timestamp: note.created_at,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          content: newNoteContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to create note');

      setNewNoteContent('');
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
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editNoteContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to update note');

      setEditingNote(null);
      setEditNoteContent('');
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await onPhotoUpload(file, selectedPhotoType);
    setShowPhotoDialog(false);
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
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setShowNoteDialog(true)} variant="outline" className="flex-1">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Note
        </Button>
        <Button onClick={() => setShowPhotoDialog(true)} variant="outline" className="flex-1">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {timeline.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No timeline entries yet. Add a photo or note to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {/* Timeline Entries */}
          <div className="space-y-6">
            {timeline.map((entry, index) => (
              <div key={entry.id} className="relative pl-12">
                {/* Timeline Dot & Date */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                
                <Card>
                  <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {entry.type === 'photo' ? (
                      <Badge variant="secondary">
                        {(entry.content as Photo).photo_type === 'progress' ? 'Progress Photo' : 'Final Photo'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Note</Badge>
                    )}
                  </div>
                  
                  {entry.type === 'photo' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPhotoDelete(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingNote(entry.content as Note);
                          setEditNoteContent((entry.content as Note).content);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {entry.type === 'photo' ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mt-4">
                    <Image
                      src={(entry.content as Photo).storage_path}
                      alt="Project photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-sm mt-2 prose prose-sm max-w-none prose-headings:font-semibold prose-a:text-primary prose-strong:font-semibold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {(entry.content as Note).content}
                    </ReactMarkdown>
                  </div>
                )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="What's happening with your project? (You can use markdown: **bold**, *italic*, - lists, etc.)"
            rows={6}
            className="bg-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNote} disabled={isSubmitting || !newNoteContent.trim()}>
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editNoteContent}
            onChange={(e) => setEditNoteContent(e.target.value)}
            placeholder="You can use markdown: **bold**, *italic*, - lists, etc."
            rows={6}
            className="bg-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNote} disabled={isSubmitting || !editNoteContent.trim()}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Photo Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedPhotoType === 'progress' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhotoType('progress')}
                  className="flex-1"
                >
                  Progress
                </Button>
                <Button
                  type="button"
                  variant={selectedPhotoType === 'final' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhotoType('final')}
                  className="flex-1"
                >
                  Final
                </Button>
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

