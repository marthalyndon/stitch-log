"use client";

import { useEffect, useState } from "react";
import { ProjectWithDetails, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingPage } from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const STATUS_COLUMNS: { id: ProjectStatus; label: string; color: string }[] = [
  { id: 'idea', label: 'Idea', color: 'bg-purple-100 border-purple-300' },
  { id: 'queue', label: 'Queue', color: 'bg-blue-100 border-blue-300' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'on-hold', label: 'On Hold', color: 'bg-gray-100 border-gray-300' },
  { id: 'completed', label: 'Completed', color: 'bg-green-100 border-green-300' },
];

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [view, setView] = useState<'list' | 'board'>('list');
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

    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
    );

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
      fetchProjects();
    }
  };

  const getProjectsByStatus = (status: ProjectStatus) => {
    return filteredProjects.filter(p => p.status === status);
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingPage message="Loading projects..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Projects</h1>
          <p className="text-muted-foreground">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          onClick={() => setView('list')}
          size="sm"
        >
          Projects
        </Button>
        <Button
          variant={view === 'board' ? 'default' : 'outline'}
          onClick={() => setView('board')}
          size="sm"
        >
          Board
        </Button>
      </div>

      {/* Filters and Search - Only show in list view */}
      {view === 'list' && (
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="queue">Queue</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <>
          {filteredProjects.length === 0 ? (
            <EmptyState
              title={searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start tracking your knitting projects by creating your first project!'
              }
              actionLabel={searchQuery || statusFilter !== 'all' ? undefined : '+ New Project'}
              actionHref={searchQuery || statusFilter !== 'all' ? undefined : '/projects/new'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Board View */}
      {view === 'board' && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {/* Main 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATUS_COLUMNS.filter(col => col.id !== 'on-hold').map((column) => (
                <KanbanColumn
                  key={column.id}
                  status={column.id}
                  label={column.label}
                  color={column.color}
                  projects={getProjectsByStatus(column.id)}
                />
              ))}
            </div>

            {/* On Hold - Full Width at Bottom */}
            <div className="w-full">
              <KanbanColumn
                status="on-hold"
                label="On Hold"
                color="bg-gray-100 border-gray-300"
                projects={getProjectsByStatus('on-hold')}
                isHorizontal={true}
              />
            </div>
          </div>

          <DragOverlay>
            {activeProject ? (
              <ProjectCardDragging project={activeProject} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

interface KanbanColumnProps {
  status: ProjectStatus;
  label: string;
  color: string;
  projects: ProjectWithDetails[];
  isHorizontal?: boolean;
}

function KanbanColumn({ status, label, color, projects, isHorizontal = false }: KanbanColumnProps) {
  const { useDroppable } = require('@dnd-kit/core');
  const { setNodeRef, isOver } = useDroppable({ id: status });

  if (isHorizontal) {
    return (
      <div
        ref={setNodeRef}
        className={`flex flex-col rounded-lg border-2 ${color} ${
          isOver ? 'ring-2 ring-primary' : ''
        } transition-all`}
      >
        <div className="p-4 border-b bg-white/50">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            {label}
            <Badge variant="outline">
              {projects.length}
            </Badge>
          </h2>
        </div>
        <div className="p-4">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No projects on hold
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {projects.map((project) => (
                <DraggableProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[500px] rounded-lg border-2 ${color} ${
        isOver ? 'ring-2 ring-primary' : ''
      } transition-all`}
    >
      <div className="p-4 border-b bg-white/50">
        <h2 className="font-semibold text-lg flex items-center justify-between">
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
      <ProjectCardDragging project={project} />
    </div>
  );
}

interface ProjectCardDraggingProps {
  project: ProjectWithDetails;
}

const statusBadgeColors: Record<ProjectStatus, string> = {
  idea: "bg-purple-100 text-purple-800",
  queue: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  "on-hold": "bg-gray-100 text-gray-800",
  completed: "bg-green-100 text-green-800",
};

function ProjectCardDragging({ project }: ProjectCardDraggingProps) {
  return (
    <Card className="cursor-move hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
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
