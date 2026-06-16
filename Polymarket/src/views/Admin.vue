<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuth } from '@/composables/useAuth'

const pending = ref([])
const loading = ref(true)
const errorMessage = ref('')
const { user } = useAuth()

async function checkAdmin() {
  if (!user.value) return false
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.value.id).single()
  return profile?.is_admin === true
}

async function loadPending() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('bets').select('*').order('created_at', { ascending: false })
    if (error) throw error
    pending.value = data || []
  } catch (e) {
    console.error(e)
    errorMessage.value = e?.message ?? 'Failed to load pending bets'
  } finally {
    loading.value = false
  }
}

async function approve(bet) {
}

onMounted(async () => {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    errorMessage.value = 'Unauthorized — admin only'
    loading.value = false
    return
  }
  await loadPending()
})
</script>

<template>
  <div style="max-width:900px;margin:2rem auto;padding:1rem">
    <h2>Admin — Pending Bets</h2>
    <div v-if="errorMessage" style="color:red">{{ errorMessage }}</div>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="b in pending" :key="b.id" style="border:1px solid #eee;padding:1rem;margin-bottom:1rem">
        <div><strong>{{ b.title }}</strong></div>
        <div>{{ b.description }}</div>
        <div>By: {{ b.creator_email || b.creator_id }}</div>
      </li>
    </ul>
  </div>
</template>
