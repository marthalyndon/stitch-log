-- Add photo_urls array to notes table
ALTER TABLE notes ADD COLUMN photo_urls TEXT[] DEFAULT '{}';

-- Drop photos table since we're integrating photos into notes
-- First, we'll keep it for backward compatibility
-- You can run DROP TABLE photos CASCADE; later if you want to fully migrate

-- Add a comment to explain the new structure
COMMENT ON COLUMN notes.photo_urls IS 'Array of storage URLs for photos attached to this note';

