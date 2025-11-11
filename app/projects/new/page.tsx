"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm, ProjectFormData } from "@/components/project-form";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const project = await response.json();
        router.push(`/projects/${project.id}`);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">New Project</h1>
        <p className="text-muted-foreground">
          Create a new knitting project to track your progress
        </p>
      </div>

      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

