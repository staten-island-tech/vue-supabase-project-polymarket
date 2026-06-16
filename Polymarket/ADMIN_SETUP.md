# Admin Account Setup

## One-Time Setup

Run this Supabase Edge Function to set up the `is_admin` column and make your user an admin.

### Step 1: Create the Edge Function in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/)
2. Navigate to **Edge Functions** (in the left sidebar)
3. Click **Create a new function** and name it `setup-admin`
4. Paste the code from `supabase/functions/setup-admin/index.ts` (see below)
5. Click **Deploy**

### Step 2: Run the Function

Open your browser console (F12) and run:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_KEY'
const userId = 'YOUR_USER_ID'

const response = await fetch(`${supabaseUrl}/functions/v1/setup-admin`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userId })
})

const result = await response.json()
console.log(result)
```

Replace:
- `YOUR_SUPABASE_URL` with your Supabase project URL (e.g., `https://xyz.supabase.co`)
- `YOUR_SUPABASE_KEY` with your publishable key (from **Settings > API**)
- `YOUR_USER_ID` with your user's UUID (from **Authentication > Users**)

### Or Run Locally

```bash
cd Polymarket
node scripts/make-admin.js YOUR_USER_ID
```

### Verify

- Log in to your app
- Navigate to `/admin`
- You should now see the Admin page instead of "Unauthorized"

## Troubleshooting

- **Function deployment failed**: Make sure you're using the correct Edge Function code and deployed it successfully
- **"Unauthorized" still showing**: Refresh the page or log out and back in to reload your session
