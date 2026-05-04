# Database Setup Guide

## Issue
When a user tries to save their profile data, they're getting a database error. This is because the `profiles` table needs to be created in your Supabase database with the proper schema and Row Level Security (RLS) policies.

## Solution

### Step 1: Run the Migration in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.co/
2. Navigate to the **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/001_create_profiles.sql`
5. Click **Run** to execute the SQL

### Step 2: Verify the Setup

After running the migration, verify that:
- The `profiles` table was created with columns: `id`, `username`, `website`, `avatar_url`, `updated_at`
- RLS policies are enabled
- The trigger `on_auth_user_created` is set up

### Step 3: Test the Application

1. Go to http://localhost:5173/
2. Click "Go to Sign Up"
3. Enter your email
4. Click "Send magic link"
5. Check your email for the login link
6. Click the link and you should be able to access your profile

## What the Migration Does

The migration SQL creates:

1. **`profiles` table** - Stores user profile information with:
   - `id` (UUID, references auth.users)
   - `username` (text, unique)
   - `website` (text)
   - `avatar_url` (text)
   - `updated_at` (timestamp)

2. **RLS Policies** - Security rules that ensure:
   - Users can only view their own profile
   - Users can only update their own profile
   - Users can only insert their own profile

3. **Automatic Profile Creation** - When a new user signs up via Supabase Auth:
   - A profile record is automatically created
   - The user ID is linked to the profile

## Troubleshooting

If you still get database errors:

1. **Check RLS is enabled**: In Supabase dashboard, go to `Authentication` > `Policies` and make sure `profiles` table has RLS enabled
2. **Check policies are correct**: Verify the policies allow the operations (select, update, insert)
3. **Check auth user ID**: Make sure the UUID in the profile matches your auth user ID
4. **Check console logs**: Open browser DevTools (F12) > Console tab to see detailed error messages

## Local Development with Supabase CLI

If you want to use local Supabase development:

```bash
supabase start
supabase migration up
```

Then update your `.env.local`:
```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjM5NTc1MDAwfQ.CRXP3ySUJaM9p7ik6CsKwLS6baJwezuCg9LvtQ1DeHg
```
