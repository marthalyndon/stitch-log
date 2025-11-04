"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectWithDetails, PhotoType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhotoUpload } from "@/components/photo-upload";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingPage } from "@/components/loading";
import Link from "next/link";

const statusColors = {
  idea: "bg-purple-100 text-purple-800",
  planned: "bg-blue-100 text-blue-800",
  queued: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

const statusLabels = {
  idea: "Idea",
  planned: "Planned",
  queued: "Queued",
  completed: "Completed",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else if (response.status === 404) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File, type: PhotoType) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      formData.append('photoType', type);

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh project to show new photo
        await fetchProject();
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh project to remove deleted photo
        await fetchProject();
      } else {
        throw new Error('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading project..." />;
  }

  if (!project) {
    return <LoadingPage message="Project not found" />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge className={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${projectId}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Pattern */}
      {project.patterns && project.patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-semibold">{project.patterns[0].name}</p>
                {project.patterns[0].designer && (
                  <p className="text-sm text-muted-foreground">by {project.patterns[0].designer}</p>
                )}
              </div>
              {project.patterns[0].source_url && (
                <a
                  href={project.patterns[0].source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Pattern →
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yarn */}
      {project.yarns && project.yarns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yarn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.yarns.map((yarn, index) => (
                <div key={yarn.id} className="pb-4 border-b last:border-0 last:pb-0">
                  <p className="font-semibold">
                    {yarn.brand} {yarn.colorway}
                  </p>
                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                    {yarn.weight && <p>Weight: {yarn.weight}</p>}
                    {yarn.fiber_content && <p>Fiber: {yarn.fiber_content}</p>}
                    {yarn.yardage > 0 && <p>Yardage: {yarn.yardage} yards</p>}
                    {yarn.notes && <p className="mt-2">{yarn.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Needles */}
      {project.needles && project.needles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Needles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.needles.map((needle) => (
                <div key={needle.id}>
                  <p>
                    <span className="font-semibold">{needle.type.toUpperCase()}</span> - Size {needle.size}
                    {needle.length && ` (${needle.length})`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      <PhotoUpload
        photos={project.photos || []}
        onUpload={handlePhotoUpload}
        onDelete={handlePhotoDelete}
        isUploading={isUploading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

