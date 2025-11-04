"use client";

import { ProjectWithDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProjectCardProps {
  project: ProjectWithDetails;
}

const statusColors = {
  idea: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  planned: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  queued: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
};

const statusLabels = {
  idea: "Idea",
  planned: "Planned",
  queued: "Queued",
  completed: "Completed",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <Badge className={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
          </div>
          {project.patterns && project.patterns.length > 0 && (
            <CardDescription className="text-sm">
              Pattern: {project.patterns[0].name}
              {project.patterns[0].designer && ` by ${project.patterns[0].designer}`}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-3">
            {project.description || "No description"}
          </p>
          
          {project.yarns && project.yarns.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Yarn:</p>
              <p className="text-sm">
                {project.yarns[0].brand} {project.yarns[0].colorway}
                {project.yarns.length > 1 && ` +${project.yarns.length - 1} more`}
              </p>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

