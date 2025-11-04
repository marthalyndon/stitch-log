# Stitch Log - Quick Reference

## Essential Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm start               # Run production build
npm run lint            # Check for linting errors

# Installation
npm install             # Install all dependencies
```

## Project Structure

```
stitch-log/
├── app/                          # Next.js App Router pages
│   ├── api/                     # API routes
│   │   ├── projects/           # Project CRUD endpoints
│   │   ├── photos/             # Photo upload endpoints
│   │   ├── tags/               # Tags endpoints
│   │   └── ravelry/            # Ravelry API integration
│   ├── projects/               # Project pages
│   │   ├── new/               # Create project
│   │   └── [id]/              # View/Edit project
│   ├── board/                  # Kanban board view
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (projects list)
│   └── globals.css            # Global styles & theme
├── components/                  # React components
│   ├── ui/                    # shadcn/ui components
│   ├── navigation.tsx         # Site navigation
│   ├── project-card.tsx       # Project display card
│   ├── project-form.tsx       # Project create/edit form
│   ├── pattern-input.tsx      # Pattern details input
│   ├── yarn-input.tsx         # Yarn details input
│   ├── needle-input.tsx       # Needle details input
│   ├── tag-input.tsx          # Tag management
│   ├── photo-upload.tsx       # Photo upload component
│   ├── loading.tsx            # Loading states
│   └── empty-state.tsx        # Empty state component
├── lib/                         # Utilities
│   ├── types.ts               # TypeScript types
│   ├── supabase.ts            # Supabase client
│   ├── db.ts                  # Database functions
│   └── utils.ts               # Helper utilities
├── supabase/
│   └── migrations/            # Database migrations
└── Documentation files
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Your Supabase anon key

# Optional (for Ravelry pattern import)
RAVELRY_API_USERNAME=            # Ravelry API username
RAVELRY_API_PASSWORD=            # Ravelry API password
```

## Database Tables

| Table | Description |
|-------|-------------|
| `projects` | Main project information |
| `patterns` | Linked pattern details |
| `yarns` | Yarn information per project |
| `needles` | Needle details per project |
| `tags` | Available tags |
| `project_tags` | Junction table for project-tag relationships |
| `photos` | Photo metadata (images stored in Supabase Storage) |

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Photos
- `POST /api/photos` - Upload photo
- `DELETE /api/photos/[id]` - Delete photo

### Tags
- `GET /api/tags` - List all tags

### Ravelry
- `POST /api/ravelry/pattern` - Import pattern from Ravelry URL

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page - projects list with search, filter, sort |
| `/board` | Kanban board view with drag-and-drop |
| `/projects/new` | Create new project |
| `/projects/[id]` | View project details |
| `/projects/[id]/edit` | Edit project |

## Design System

### Colors
- **Primary**: #0DC1D1 (teal) - buttons, links, accents
- **Destructive**: #E82103 (red) - delete actions, errors
- **Grays**: Teal-tinted neutrals

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Roboto (sans-serif)

### Border Radius
- Generous rounded corners (14px base)

### Status Colors
- **Idea**: Purple
- **Planned**: Blue  
- **Queued**: Yellow
- **Completed**: Green

## Key Features

✅ Create, read, update, delete projects  
✅ Ravelry pattern import via API  
✅ Photo upload to Supabase Storage  
✅ Multiple yarns per project  
✅ Multiple needles per project  
✅ Tagging system with autocomplete  
✅ Search and filter projects  
✅ Sort by date or name  
✅ Drag-and-drop Kanban board  
✅ Progress and final photo galleries  
✅ Responsive design  
✅ Loading states  
✅ Empty states  

## Common Tasks

### Add a New Component
```bash
npx shadcn@latest add [component-name]
```

### Run Database Migration
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`

### Reset Database
1. In Supabase Dashboard, go to Database → Tables
2. Delete all tables
3. Re-run migration script

### Clear Storage
1. In Supabase Dashboard, go to Storage
2. Select `project-photos` bucket
3. Delete all files (or specific files)

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| White screen | Check Supabase credentials in `.env.local` |
| Projects not loading | Verify database migration was run |
| Photos won't upload | Check storage bucket exists and policies are set |
| Ravelry import fails | Verify API credentials, check pattern URL format |
| Drag-drop not working | Refresh page, check JavaScript is enabled |

## Documentation Files

- **README.md** - Overview and setup instructions
- **GETTING_STARTED.md** - User guide and first steps
- **SUPABASE_SETUP.md** - Detailed Supabase configuration
- **RAVELRY_API_SETUP.md** - Ravelry API credentials setup
- **QUICK_REFERENCE.md** - This file

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Ravelry API Docs](https://www.ravelry.com/api)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

