"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectWithDetails } from "@/lib/types";
import { ProjectForm, ProjectFormData } from "@/components/project-form";
import { LoadingPage } from "@/components/loading";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push(`/projects/${projectId}`);
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/projects/${projectId}`);
  };

  if (loading) {
    return <LoadingPage message="Loading project..." />;
  }

  if (!project) {
    return <LoadingPage message="Project not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Edit Project</h1>
        <p className="text-muted-foreground">
          Update details for "{project.name}"
        </p>
      </div>

      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

