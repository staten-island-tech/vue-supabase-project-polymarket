import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

export const getSupabase = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Supabase configuration missing. ` +
      `URL: ${supabaseUrl ? 'loaded' : 'missing'}, ` +
      `Key: ${supabaseKey ? 'loaded' : 'missing'}. ` +
      `Please ensure .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.`
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

// Export a direct reference for convenience
export const supabase = new Proxy({}, {
  get: (target, prop) => {
    return getSupabase()[prop];
  }
});