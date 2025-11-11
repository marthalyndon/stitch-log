-- Remove the notes column from projects (we'll use a separate table now)
ALTER TABLE projects DROP COLUMN IF EXISTS notes;

-- Create notes table for timeline entries
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX notes_project_id_idx ON notes(project_id);
CREATE INDEX notes_created_at_idx ON notes(created_at);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Enable read access for all users" ON notes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON notes
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON notes
  FOR DELETE USING (true);

