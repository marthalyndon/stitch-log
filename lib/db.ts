import { supabase } from './supabase';
import { Project, ProjectWithDetails, Pattern, Yarn, Needle, Tag, Photo, Note, ProjectStatus } from './types';

// Projects
export async function getProjects(): Promise<ProjectWithDetails[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      patterns (*),
      yarns (*),
      needles (*),
      photos (*),
      notes (*),
      project_tags (
        tags (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform the data to flatten tags
  return (projects || []).map((project: any) => ({
    ...project,
    tags: project.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
    project_tags: undefined,
  }));
}

export async function getProjectById(id: string): Promise<ProjectWithDetails | null> {
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      patterns (*),
      yarns (*),
      needles (*),
      photos (*),
      notes (*),
      project_tags (
        tags (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  // Transform the data to flatten tags
  return {
    ...project,
    tags: project.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
    project_tags: undefined,
  };
}

export async function createProject(data: {
  name: string;
  description: string;
  status: ProjectStatus;
  pattern?: Omit<Pattern, 'id' | 'project_id'> | null;
  yarns?: Omit<Yarn, 'id' | 'project_id'>[];
  needles?: Omit<Needle, 'id' | 'project_id'>[];
  tags?: string[];
}): Promise<ProjectWithDetails> {
  // Create project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      name: data.name,
      description: data.description,
      status: data.status,
    })
    .select()
    .single();

  if (projectError) throw projectError;

  // Create pattern if provided
  if (data.pattern && data.pattern.name) {
    const { error: patternError } = await supabase
      .from('patterns')
      .insert({
        project_id: project.id,
        ...data.pattern,
      });

    if (patternError) throw patternError;
  }

  // Create yarns if provided
  if (data.yarns && data.yarns.length > 0) {
    const yarnsToInsert = data.yarns.map(yarn => ({
      project_id: project.id,
      ...yarn,
    }));

    const { error: yarnsError } = await supabase
      .from('yarns')
      .insert(yarnsToInsert);

    if (yarnsError) throw yarnsError;
  }

  // Create needles if provided
  if (data.needles && data.needles.length > 0) {
    const needlesToInsert = data.needles.map(needle => ({
      project_id: project.id,
      ...needle,
    }));

    const { error: needlesError } = await supabase
      .from('needles')
      .insert(needlesToInsert);

    if (needlesError) throw needlesError;
  }

  // Create tags and associations if provided
  if (data.tags && data.tags.length > 0) {
    for (const tagName of data.tags) {
      // Upsert tag
      const { data: tag, error: tagError } = await supabase
        .from('tags')
        .upsert({ name: tagName }, { onConflict: 'name' })
        .select()
        .single();

      if (tagError) throw tagError;

      // Create project-tag association
      const { error: ptError } = await supabase
        .from('project_tags')
        .insert({
          project_id: project.id,
          tag_id: tag.id,
        });

      if (ptError) throw ptError;
    }
  }

  // Fetch and return complete project
  const completeProject = await getProjectById(project.id);
  if (!completeProject) throw new Error('Failed to fetch created project');
  return completeProject;
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    pattern?: Omit<Pattern, 'id' | 'project_id'> | null;
    yarns?: Omit<Yarn, 'id' | 'project_id'>[];
    needles?: Omit<Needle, 'id' | 'project_id'>[];
    tags?: string[];
  }
): Promise<ProjectWithDetails> {
  // Update project
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;

  const { error: projectError } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);

  if (projectError) throw projectError;

  // Update pattern (delete old and create new)
  if (data.pattern !== undefined) {
    await supabase.from('patterns').delete().eq('project_id', id);
    
    if (data.pattern && data.pattern.name) {
      const { error: patternError } = await supabase
        .from('patterns')
        .insert({
          project_id: id,
          ...data.pattern,
        });

      if (patternError) throw patternError;
    }
  }

  // Update yarns (delete old and create new)
  if (data.yarns !== undefined) {
    await supabase.from('yarns').delete().eq('project_id', id);
    
    if (data.yarns.length > 0) {
      const yarnsToInsert = data.yarns.map(yarn => ({
        project_id: id,
        ...yarn,
      }));

      const { error: yarnsError } = await supabase
        .from('yarns')
        .insert(yarnsToInsert);

      if (yarnsError) throw yarnsError;
    }
  }

  // Update needles (delete old and create new)
  if (data.needles !== undefined) {
    await supabase.from('needles').delete().eq('project_id', id);
    
    if (data.needles.length > 0) {
      const needlesToInsert = data.needles.map(needle => ({
        project_id: id,
        ...needle,
      }));

      const { error: needlesError } = await supabase
        .from('needles')
        .insert(needlesToInsert);

      if (needlesError) throw needlesError;
    }
  }

  // Update tags (delete old and create new associations)
  if (data.tags !== undefined) {
    await supabase.from('project_tags').delete().eq('project_id', id);
    
    if (data.tags.length > 0) {
      for (const tagName of data.tags) {
        const { data: tag, error: tagError } = await supabase
          .from('tags')
          .upsert({ name: tagName }, { onConflict: 'name' })
          .select()
          .single();

        if (tagError) throw tagError;

        const { error: ptError } = await supabase
          .from('project_tags')
          .insert({
            project_id: id,
            tag_id: tag.id,
          });

        if (ptError) throw ptError;
      }
    }
  }

  // Fetch and return updated project
  const updatedProject = await getProjectById(id);
  if (!updatedProject) throw new Error('Failed to fetch updated project');
  return updatedProject;
}

export async function deleteProject(id: string): Promise<void> {
  // Delete project (cascades to related tables)
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Tags
export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Photos
export async function uploadPhoto(
  projectId: string,
  file: File,
  photoType: 'progress' | 'final'
): Promise<Photo> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}/${Date.now()}.${fileExt}`;

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from('project-photos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('project-photos')
    .getPublicUrl(fileName);

  // Create photo record
  const { data: photo, error: photoError } = await supabase
    .from('photos')
    .insert({
      project_id: projectId,
      storage_path: publicUrl,
      photo_type: photoType,
    })
    .select()
    .single();

  if (photoError) throw photoError;
  return photo;
}

export async function deletePhoto(photoId: string): Promise<void> {
  // Get photo details to extract storage path
  const { data: photo, error: fetchError } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('id', photoId)
    .single();

  if (fetchError) throw fetchError;

  // Extract file path from URL
  const url = new URL(photo.storage_path);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf('project-photos') + 1).join('/');

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('project-photos')
    .remove([filePath]);

  if (storageError) throw storageError;

  // Delete photo record
  const { error: deleteError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);

  if (deleteError) throw deleteError;
}

