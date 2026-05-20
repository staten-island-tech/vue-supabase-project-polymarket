<!-- <template>
    <div class="SignUp">
        <h2>Sign Up</h2>
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="text" placeholder="Confirm Password" />
        <button>Sign Up</button>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style> -->
<script setup>
import { onMounted, ref } from 'vue'
import Account from '@/components/Account.vue'
import Auth from '@/components/Auth.vue'
import { supabase } from '../supabase'

const claims = ref(null)
const loading = ref(true)

onMounted(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data }) => {
    if (data?.session?.user) {
      claims.value = data.session.user
    }
    loading.value = false
  }).catch(error => {
    console.error('Error getting session:', error)
    loading.value = false
  })

  // Listen for auth state changes
  const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id)
    if (session?.user) {
      claims.value = session.user
    } else {
      claims.value = null
    }
    loading.value = false
  })

  // Cleanup subscription
  return () => {
    subscription?.unsubscribe()
  }
})
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <div v-if="loading" style="text-align: center; padding: 2rem;">Loading...</div>
    <Account v-else-if="claims" :claims="claims" />
    <Auth v-else />
  </div>
</template>