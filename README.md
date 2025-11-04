# Stitch Log - Knitting Project Tracker

A modern web application for tracking your knitting projects, patterns, yarn stash, and progress.

## Features

- 📝 Create and manage knitting projects
- 🧶 Track yarn details (brand, colorway, weight, fiber content)
- 🪡 Record needle information (size, type, length)
- 🎨 Add tags to organize projects
- 📸 Upload progress and final project photos
- 🔗 Scrape pattern information from Ravelry links
- 📊 View projects in list or Kanban board format
- 🔍 Search, filter, and sort your projects
- 🎯 Track project status (Idea, Planned, Queued, Completed)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS
- **UI Components**: shadcn/ui with custom design system
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for photos
- **Drag & Drop**: @dnd-kit for Kanban board

## Design System

- **Primary Color**: #0DC1D1 (teal)
- **Warning Color**: #E82103 (red)
- **Typography**: 
  - Headings: Playfair Display (serif)
  - Body: Roboto (sans-serif)
- **Border Radius**: Generous rounded corners (14px)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stitch-log
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the migration file located at `supabase/migrations/001_initial_schema.sql`
   - Create a storage bucket named `project-photos` with public access
   - See `SUPABASE_SETUP.md` for detailed instructions

5. (Optional) Set up Ravelry API for pattern import:
   - See `RAVELRY_API_SETUP.md` for instructions
   - Get your API credentials from [Ravelry Pro Developer](https://www.ravelry.com/pro/developer)
   - Add credentials to your `.env.local` file

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following tables:
- `projects` - Main project information
- `patterns` - Linked patterns (from Ravelry or manual entry)
- `yarns` - Yarn details for each project
- `needles` - Needle information for each project
- `tags` - Project tags for organization
- `project_tags` - Junction table for many-to-many relationship
- `photos` - Project photos stored in Supabase Storage

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Supabase Storage Setup

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket called `project-photos`
4. Set the bucket to public access
5. Configure the following storage policies:
   - Allow INSERT for authenticated users
   - Allow SELECT for everyone (public read)
   - Allow DELETE for authenticated users

## Future Enhancements

- User authentication
- Project sharing
- Export project data
- Pattern library integration with Ravelry API
- Advanced filtering and sorting options
- Project statistics and analytics

## Documentation

- **[Getting Started Guide](GETTING_STARTED.md)** - Step-by-step user guide
- **[Supabase Setup](SUPABASE_SETUP.md)** - Database configuration
- **[Ravelry API Setup](RAVELRY_API_SETUP.md)** - Pattern import setup
- **[Quick Reference](QUICK_REFERENCE.md)** - Developer reference
- **[Project Summary](PROJECT_SUMMARY.md)** - What was built

## License

MIT
