<script setup>
import { onMounted, ref } from 'vue'
import Account from '@/components/Account.vue'
import Auth from '@/components/Auth.vue'
import { supabase } from '../supabase'

const claims = ref(null)
const loading = ref(true)

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data?.session?.user) {
      claims.value = data.session.user
    }
    loading.value = false
  }).catch(error => {
    console.error('Error getting session:', error)
    loading.value = false
  })

  const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id)
    if (session?.user) {
      claims.value = session.user
    } else {
      claims.value = null
    }
    loading.value = false
  })

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