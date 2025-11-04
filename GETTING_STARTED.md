# Getting Started with Stitch Log

Welcome to Stitch Log! This guide will help you set up and start using your knitting project tracker.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Ravelry API (for pattern import)
RAVELRY_API_USERNAME=your_ravelry_api_username
RAVELRY_API_PASSWORD=your_ravelry_api_password
```

### 3. Set Up Supabase

Follow the detailed instructions in `SUPABASE_SETUP.md` to:
- Create your Supabase project
- Run the database migration
- Set up the storage bucket for photos

### 4. (Optional) Set Up Ravelry API

If you want to import patterns from Ravelry, follow `RAVELRY_API_SETUP.md` to:
- Create a Ravelry developer account
- Get your API credentials
- Add them to your `.env.local` file

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## First Steps

### Creating Your First Project

1. Click the **"+ New Project"** button in the navigation
2. Fill in the project details:
   - **Name** (required): Give your project a name
   - **Description**: Add details about what you're making
   - **Status**: Choose from Idea, Planned, Queued, or Completed
3. (Optional) Import a pattern from Ravelry by pasting the URL
4. Add yarn details:
   - Brand, colorway, weight
   - Fiber content and yardage
   - Any notes about the yarn
5. Add needle information:
   - Type (circular, straight, DPN, interchangeable)
   - Size (e.g., US 7 / 4.5mm)
   - Length (for circular needles)
6. Add tags to organize your projects
7. Click **"Create Project"**

### Viewing Your Projects

#### List View (Home Page)
- See all your projects as cards
- Search by project name or description
- Filter by status
- Sort by newest, oldest, or name

#### Board View (Kanban)
- Visualize projects organized by status
- Drag and drop projects between columns to update status
- Perfect for tracking progress at a glance

### Managing a Project

Click on any project to:
- View all details (pattern, yarn, needles, tags)
- Upload progress photos
- Upload final project photos
- Edit project details
- Delete the project

### Uploading Photos

1. Open a project
2. Scroll to the Photos section
3. Choose photo type (Progress or Final)
4. Click "Choose File" and select an image
5. Photos are automatically uploaded to Supabase Storage

## Features Overview

### Pattern Import
- Paste any Ravelry pattern URL
- Automatically imports pattern name, designer, and details
- Requires Ravelry API credentials (see setup guide)

### Yarn Tracking
- Add multiple yarns per project
- Track brand, colorway, weight, fiber content
- Record yardage for planning future projects
- Add notes about each yarn

### Needle Management
- Record all needles used in a project
- Support for different types (circular, DPN, etc.)
- Track sizes in US, metric, or both

### Tags & Organization
- Create custom tags
- Tag suggestions as you type
- Filter projects by tags
- Great for organizing by recipient, season, technique, etc.

### Photo Gallery
- Separate progress and final photos
- Full-size image viewing
- Easy deletion of photos

### Drag & Drop Board
- Visual Kanban-style project board
- Four columns: Idea, Planned, Queued, Completed
- Drag projects between columns to update status
- See project count in each status at a glance

## Tips & Best Practices

### Organizing Projects

**Use descriptive names**: Instead of "Sweater", try "Mom's Birthday Sweater 2024"

**Add detailed descriptions**: Include size, modifications, or who it's for

**Tag consistently**: Use tags like "gift", "for-me", "baby", "winter", etc.

**Update status regularly**: Move projects through the board as you work on them

### Pattern Import

- Works best with patterns from Ravelry library
- URL format: `https://www.ravelry.com/patterns/library/pattern-name`
- You can also manually enter pattern details if import isn't working

### Yarn Notes

- Record dye lot numbers in the notes field
- Note where you purchased the yarn
- Track how much you used vs. bought for future reference

### Photo Tips

- Take progress photos regularly to track your journey
- Final photos are great for portfolios or sharing on social media
- Images are stored securely in your Supabase account

## Keyboard Shortcuts

- **Cmd/Ctrl + Click** on project cards to open in new tab

## Troubleshooting

### Projects not loading
- Check that your Supabase credentials are correct in `.env.local`
- Make sure you ran the database migration
- Check browser console for errors

### Can't upload photos
- Verify the `project-photos` storage bucket exists in Supabase
- Check that storage policies are set up correctly
- Ensure images are in supported formats (JPEG, PNG, GIF, WebP)

### Ravelry import not working
- Verify your Ravelry API credentials in `.env.local`
- Check that the pattern URL is correct
- Try the pattern URL in a browser to ensure it's accessible

### Drag and drop not working on board
- Try refreshing the page
- Check that JavaScript is enabled
- Make sure you're clicking and holding before dragging

## Need More Help?

- Check the main README.md for technical details
- Review SUPABASE_SETUP.md for database issues
- See RAVELRY_API_SETUP.md for pattern import problems

## What's Next?

Now that you're set up, start tracking your projects! Here are some ideas:

1. **Create projects for your current WIPs** (Works In Progress)
2. **Add your project queue** - all those patterns you want to make
3. **Document finished projects** - add photos and details for your portfolio
4. **Track ideas** - save patterns and yarn combinations for future projects

Happy knitting! 🧶

