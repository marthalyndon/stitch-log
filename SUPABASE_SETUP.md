# Supabase Setup Guide

Follow these steps to set up your Supabase backend for Stitch Log.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create an account
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "stitch-log")
5. Create a strong database password (save this!)
6. Choose your region (closest to you)
7. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (a long JWT token)
3. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Run the Database Migration

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" or press `Cmd/Ctrl + Enter`
6. You should see a success message

This will create:
- All database tables (projects, patterns, yarns, needles, tags, project_tags, photos)
- Indexes for better performance
- Row Level Security policies
- Automatic timestamp updates

## Step 4: Create Storage Bucket for Photos

1. Go to **Storage** in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it: `project-photos`
4. Make it **Public** (check the "Public bucket" option)
5. Click "Create bucket"

### Configure Storage Policies

After creating the bucket, you need to set up policies:

1. Click on the `project-photos` bucket
2. Go to **Policies**
3. Click "New Policy"

**Policy 1: Allow Public Read**
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- Click "Review" then "Save policy"

**Policy 2: Allow All Insert**
- Policy name: `Allow all uploads`
- Allowed operation: `INSERT`
- Click "Use this template" under "Allow access to everyone"
- Click "Review" then "Save policy"

**Policy 3: Allow All Delete**
- Policy name: `Allow all deletes`
- Allowed operation: `DELETE`
- Click "Use this template" under "Allow access to everyone"
- Click "Review" then "Save policy"

## Step 5: Verify Setup

Run this query in the SQL Editor to verify your tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see all 7 tables listed:
- needles
- patterns
- photos
- project_tags
- projects
- tags
- yarns

## Step 6: Test the Connection

1. Make sure your `.env.local` file has the correct credentials
2. Restart your development server:
```bash
npm run dev
```

3. The app should now connect to Supabase successfully!

## Optional: Add Sample Data

You can add some test data through the Supabase dashboard:

1. Go to **Table Editor**
2. Select the `projects` table
3. Click "Insert row"
4. Add a test project

Or run this in SQL Editor:

```sql
-- Insert a sample project
INSERT INTO projects (name, description, status)
VALUES ('Test Sweater', 'A cozy test project', 'idea');

-- Insert sample tags
INSERT INTO tags (name)
VALUES ('sweater'), ('cozy'), ('gift');
```

## Troubleshooting

**Issue: Can't connect to Supabase**
- Check that your `.env.local` file exists and has the correct values
- Restart your development server after creating/updating `.env.local`
- Make sure you're using `NEXT_PUBLIC_` prefix for the environment variables

**Issue: Permission denied errors**
- Check that you ran the migration SQL which includes RLS policies
- Verify policies in Supabase dashboard under Authentication → Policies

**Issue: Can't upload photos**
- Verify the `project-photos` bucket exists and is public
- Check storage policies are set correctly
- Make sure the bucket name matches exactly in your code

**Issue: Tables don't exist**
- Re-run the migration SQL in the SQL Editor
- Check for any error messages in the SQL Editor
- Make sure you selected the correct project

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

