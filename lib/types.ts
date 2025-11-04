// Database types for Stitch Log

export type ProjectStatus = 'idea' | 'planned' | 'queued' | 'completed';
export type PhotoType = 'progress' | 'final';
export type YarnWeight = 'lace' | 'fingering' | 'sport' | 'dk' | 'worsted' | 'aran' | 'bulky' | 'super-bulky' | 'jumbo';
export type NeedleType = 'circular' | 'straight' | 'dpn' | 'interchangeable';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Pattern {
  id: string;
  project_id: string;
  name: string;
  source_url: string;
  designer: string;
  scraped_data?: Record<string, any>;
}

export interface Yarn {
  id: string;
  project_id: string;
  brand: string;
  colorway: string;
  weight: YarnWeight | string;
  fiber_content: string;
  yardage: number;
  notes?: string;
}

export interface Needle {
  id: string;
  project_id: string;
  size: string;
  type: NeedleType;
  length?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ProjectTag {
  project_id: string;
  tag_id: string;
}

export interface Photo {
  id: string;
  project_id: string;
  storage_path: string;
  photo_type: PhotoType;
  uploaded_at: string;
}

// Extended types with relationships
export interface ProjectWithDetails extends Project {
  patterns?: Pattern[];
  yarns?: Yarn[];
  needles?: Needle[];
  tags?: Tag[];
  photos?: Photo[];
}

