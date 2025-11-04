# Ravelry API Setup Guide

To use the pattern import feature, you'll need to set up Ravelry API access.

## Step 1: Create a Ravelry Developer Account

1. Go to [Ravelry Pro Developer](https://www.ravelry.com/pro/developer)
2. Sign in with your Ravelry account (or create one if you don't have it)
3. Click "Create a new app"

## Step 2: Register Your Application

Fill out the application form:

- **App Name**: `Stitch Log` (or your preferred name)
- **Description**: `Personal knitting project tracker`
- **Website URL**: Your app URL (for local development, you can use `http://localhost:3000`)
- **Callback URL**: Not needed for Basic Auth (leave blank or use your website URL)
- **Icon**: Optional

Click "Create App" to submit.

## Step 3: Get Your API Credentials

After creating your app, you'll see:
- **Basic auth key** (username)
- **Personal key** (password)

**IMPORTANT:** These are your API credentials. Keep them secure!

## Step 4: Add Credentials to Your Environment

Add these to your `.env.local` file:

```bash
# Ravelry API Configuration
RAVELRY_API_USERNAME=your_basic_auth_key_here
RAVELRY_API_PASSWORD=your_personal_key_here
```

## Step 5: Restart Your Development Server

After adding the credentials, restart your Next.js server:

```bash
npm run dev
```

## Using the Pattern Import Feature

1. Go to a pattern page on Ravelry (e.g., `https://www.ravelry.com/patterns/library/pattern-name`)
2. Copy the URL
3. In your Stitch Log project form, paste the URL in the "Import from Ravelry" section
4. Click "Import"

The app will automatically fetch:
- Pattern name
- Designer name
- Pattern details (difficulty, yardage, gauge, etc.)
- Photos

## API Limits & Usage

- Ravelry has rate limits on API calls
- The free tier allows reasonable usage for personal projects
- For commercial use or high-volume apps, contact Ravelry about their API plans

## Troubleshooting

**Error: "Ravelry API credentials not configured"**
- Make sure you've added both `RAVELRY_API_USERNAME` and `RAVELRY_API_PASSWORD` to `.env.local`
- Restart your development server after adding credentials

**Error: "Invalid Ravelry API credentials"**
- Double-check that you copied the credentials correctly
- Make sure you're using the Basic auth key (not your Ravelry password)

**Error: "Pattern not found on Ravelry"**
- Verify the URL is correct
- Make sure the pattern is publicly accessible on Ravelry

**Error: "Invalid Ravelry pattern URL"**
- The URL should be in format: `https://www.ravelry.com/patterns/library/pattern-name`
- Some pattern URLs may have additional parameters - try removing them

## API Documentation

For more information about the Ravelry API:
- [Official API Documentation](https://www.ravelry.com/api)
- [API Terms of Service](https://www.ravelry.com/api#terms_of_service)

## Rate Limiting Best Practices

- Cache pattern data when possible
- Don't make excessive API calls
- Respect Ravelry's API terms of service
- For production apps, implement proper rate limiting

## Privacy & Data Storage

When you import a pattern:
- Only public pattern information is fetched
- Data is stored in your own Supabase database
- No Ravelry user data is accessed
- Pattern images are referenced by URL (not downloaded)

