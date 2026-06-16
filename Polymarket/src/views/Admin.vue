<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuth } from '@/composables/useAuth'

const pending = ref([])
const loading = ref(true)
const errorMessage = ref('')
const { user } = useAuth()

function isAdmin(u) {
  
  return !!(u?.user_metadata?.is_admin || u?.app_metadata?.is_admin)
}

async function loadPending() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('bets').select('*').eq('approved', false).order('created_at', { ascending: false })
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
  try {
  const { error } = await supabase.rpc('approve_bet_and_credit', { p_bet_id: bet.id, p_admin_id: user.value?.id })
  if (error) throw error
  pending.value = pending.value.filter((p) => p.id !== bet.id)
  } catch (e) {
    console.error(e)
    alert('Failed to approve: ' + (e?.message || 'unknown'))
  }
}

onMounted(async () => {
  if (!isAdmin(user.value)) {
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
        <div>By: {{ b.owner_email }}</div>
        <button @click="approve(b)">Approve</button>
      </li>
    </ul>
  </div>
</template>
