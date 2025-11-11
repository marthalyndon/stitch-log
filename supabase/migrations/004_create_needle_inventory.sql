-- Create needle inventory table
CREATE TABLE needle_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  size TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('circular', 'straight', 'dpn', 'interchangeable')),
  length TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX needle_inventory_type_idx ON needle_inventory(type);
CREATE INDEX needle_inventory_size_idx ON needle_inventory(size);

-- Enable RLS
ALTER TABLE needle_inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON needle_inventory
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON needle_inventory
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON needle_inventory
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON needle_inventory
  FOR DELETE USING (true);

