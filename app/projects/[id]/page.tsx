"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectWithDetails, PhotoType, ProjectStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectTimeline } from "@/components/project-timeline";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingPage } from "@/components/loading";
import Link from "next/link";
import Image from "next/image";

const statusColors: Record<ProjectStatus, string> = {
  idea: "bg-purple-100 text-purple-800",
  queue: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  "on-hold": "bg-gray-100 text-gray-800",
  completed: "bg-green-100 text-green-800",
};

const statusLabels: Record<ProjectStatus, string> = {
  idea: "Idea",
  queue: "Queue",
  "in-progress": "In Progress",
  "on-hold": "On Hold",
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

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setProject(prev => prev ? { ...prev, status: newStatus } : null);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
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
    if (!confirm('Delete this photo?')) return;

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
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

  const patternData = project.patterns?.[0]?.scraped_data;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
          </div>
          
          {/* Status Dropdown */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Status:</span>
            <Select value={project.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Idea
                  </span>
                </SelectItem>
                <SelectItem value="queue">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Queue
                  </span>
                </SelectItem>
                <SelectItem value="in-progress">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    In Progress
                  </span>
                </SelectItem>
                <SelectItem value="on-hold">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    On Hold
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Completed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - Timeline */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
            <ProjectTimeline
              projectId={projectId}
              photos={project.photos || []}
              notes={project.notes || []}
              onUpdate={fetchProject}
              onPhotoUpload={handlePhotoUpload}
              onPhotoDelete={handlePhotoDelete}
              isUploading={isUploading}
            />
          </div>
        </div>

        {/* Sidebar - Pattern & Materials Reference */}
        <div className="space-y-6">
          {/* Pattern Details */}
          {project.patterns && project.patterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pattern</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Pattern Photo */}
                {patternData?.photos?.[0] && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={patternData.photos[0].medium_url}
                      alt={project.patterns[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div>
                  <p className="font-semibold text-base">{project.patterns[0].name}</p>
                  {project.patterns[0].designer && (
                    <p className="text-sm text-muted-foreground">by {project.patterns[0].designer}</p>
                  )}
                </div>

                {/* Pattern Stats */}
                {patternData && (
                  <div className="space-y-2 text-sm">
                    {patternData.difficulty && (
                      <div>
                        <span className="font-medium">Difficulty: </span>
                        <span>{Math.round(patternData.difficulty)}/10</span>
                      </div>
                    )}
                    
                    {patternData.yardage && (
                      <div>
                        <span className="font-medium">Yardage: </span>
                        <span>
                          {patternData.yardage}
                          {patternData.yardage_max && ` - ${patternData.yardage_max}`} yards
                        </span>
                      </div>
                    )}

                    {patternData.gauge && (
                      <div>
                        <span className="font-medium">Gauge: </span>
                        <span>{patternData.gauge} sts</span>
                      </div>
                    )}

                    {patternData.sizes_available && (
                      <div>
                        <span className="font-medium">Sizes: </span>
                        <span className="text-xs">{patternData.sizes_available}</span>
                      </div>
                    )}

                    {patternData.categories && patternData.categories.length > 0 && (
                      <div>
                        <span className="font-medium">Type: </span>
                        <span className="text-xs">{patternData.categories.join(', ')}</span>
                      </div>
                    )}

                    {typeof patternData.free !== 'undefined' && (
                      <div>
                        <Badge variant={patternData.free ? "secondary" : "outline"}>
                          {patternData.free ? 'Free' : `${patternData.currency || '$'}${patternData.price}`}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {project.patterns[0].source_url && (
                  <a
                    href={project.patterns[0].source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline block"
                  >
                    View on Ravelry →
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Yarn */}
          {project.yarns && project.yarns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yarn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.yarns.map((yarn) => (
                    <div key={yarn.id} className="text-sm space-y-1">
                      <p className="font-semibold">
                        {yarn.brand} {yarn.colorway}
                      </p>
                      {yarn.weight && <p className="text-xs text-muted-foreground">{yarn.weight}</p>}
                      {yarn.fiber_content && <p className="text-xs text-muted-foreground">{yarn.fiber_content}</p>}
                      {yarn.yardage > 0 && <p className="text-xs text-muted-foreground">{yarn.yardage} yards</p>}
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
                <CardTitle className="text-lg">Needles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {project.needles.map((needle) => (
                    <div key={needle.id}>
                      <span className="font-semibold">{needle.type.toUpperCase()}</span>
                      <span className="text-muted-foreground"> - Size {needle.size}</span>
                      {needle.length && <span className="text-muted-foreground"> ({needle.length})</span>}
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
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
