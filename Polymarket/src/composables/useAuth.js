import { ref } from 'vue'
import { supabase } from '@/supabase'

const user = ref(null)
const loading = ref(true)
let subscription = null

async function init() {
  if (subscription) return

  try {
    const { data } = await supabase.auth.getSession()
    user.value = data?.session?.user ?? null
  } catch (e) {
    user.value = null
  } finally {
    loading.value = false
  }

  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
  subscription = sub
}

export function useAuth() {
  init()

  return {
    user,
    loading,
    signOut: async () => {
      await supabase.auth.signOut()
    },
    _cleanup: () => {
      subscription?.unsubscribe()
      subscription = null
    }
  }
}
