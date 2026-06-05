import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

export const getSupabase = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = "https://qfvweombcnfptqridxzq.supabase.co/rest/v1/";
  const supabaseKey = "sb_publishable_p7WqU1LGzI2X2ne0pVhpBw_Ey7gLCjd";

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    return getSupabase()[prop];
  }
});