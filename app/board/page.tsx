"use client";

import { useEffect, useState } from "react";
import { ProjectWithDetails, ProjectStatus } from "@/lib/types";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingPage } from "@/components/loading";
import Link from "next/link";

const STATUS_COLUMNS: { id: ProjectStatus; label: string; color: string }[] = [
  { id: 'idea', label: 'Idea', color: 'bg-purple-100 border-purple-300' },
  { id: 'planned', label: 'Planned', color: 'bg-blue-100 border-blue-300' },
  { id: 'queued', label: 'Queued', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'completed', label: 'Completed', color: 'bg-green-100 border-green-300' },
];

const statusBadgeColors = {
  idea: "bg-purple-100 text-purple-800",
  planned: "bg-blue-100 text-blue-800",
  queued: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

export default function BoardPage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<ProjectWithDetails | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const project = projects.find(p => p.id === event.active.id);
    setActiveProject(project || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over || active.id === over.id) return;

    const projectId = active.id as string;
    const newStatus = over.id as ProjectStatus;

    // Optimistically update UI
    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
    );

    // Update in database
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      // Revert on error
      fetchProjects();
    }
  };

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(p => p.status === status);
  };

  if (loading) {
    return <LoadingPage message="Loading project board..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Project Board</h1>
        <p className="text-muted-foreground">
          Drag and drop projects to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATUS_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              status={column.id}
              label={column.label}
              color={column.color}
              projects={getProjectsByStatus(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeProject ? (
            <ProjectCard project={activeProject} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

interface KanbanColumnProps {
  status: ProjectStatus;
  label: string;
  color: string;
  projects: ProjectWithDetails[];
}

function KanbanColumn({ status, label, color, projects }: KanbanColumnProps) {
  const { useDroppable } = require('@dnd-kit/core');
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[500px] rounded-lg border-2 ${color} ${
        isOver ? 'ring-2 ring-primary' : ''
      } transition-all`}
    >
      <div className="p-4 border-b bg-white/50">
        <h2 className="font-serif font-semibold text-lg flex items-center justify-between">
          {label}
          <Badge variant="outline" className="ml-2">
            {projects.length}
          </Badge>
        </h2>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {projects.map((project) => (
          <DraggableProjectCard key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No projects
          </p>
        )}
      </div>
    </div>
  );
}

interface DraggableProjectCardProps {
  project: ProjectWithDetails;
}

function DraggableProjectCard({ project }: DraggableProjectCardProps) {
  const { useDraggable } = require('@dnd-kit/core');
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? 'opacity-50' : ''}
    >
      <ProjectCard project={project} />
    </div>
  );
}

interface ProjectCardProps {
  project: ProjectWithDetails;
  isDragging?: boolean;
}

function ProjectCard({ project, isDragging = false }: ProjectCardProps) {
  return (
    <Card className={`cursor-move hover:shadow-md transition-shadow ${isDragging ? 'rotate-3 shadow-lg' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-serif">
          <Link href={`/projects/${project.id}`} className="hover:text-primary" onClick={(e) => e.stopPropagation()}>
            {project.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        
        {project.patterns && project.patterns.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Pattern: {project.patterns[0].name}
          </p>
        )}

        {project.yarns && project.yarns.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {project.yarns[0].brand} {project.yarns[0].colorway}
          </p>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {project.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

