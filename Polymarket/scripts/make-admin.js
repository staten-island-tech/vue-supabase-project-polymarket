import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function makeAdmin(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('Error updating profile:', error)
      process.exit(1)
    }

    console.log(`✓ User ${userId} is now an admin`)
    console.log('Data:', data)
  } catch (err) {
    console.error('Failed:', err)
    process.exit(1)
  }
}

const userId = process.argv[2]
if (!userId) {
  console.error('Usage: node scripts/make-admin.js <user-id>')
  console.error('Example: node scripts/make-admin.js 550e8400-e29b-41d4-a716-446655440000')
  process.exit(1)
}

makeAdmin(userId)
