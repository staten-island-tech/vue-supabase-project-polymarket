<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuth } from '@/composables/useAuth'

const bets = ref([])
const loading = ref(true)
const balance = ref(0)
const { user } = useAuth()

async function loadBets() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('bets').select('*').order('created_at', { ascending: false })
    if (error) throw error
    bets.value = data || []
    // load profile balance if user present
    if (user.value) {
      const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.value.id).single()
      balance.value = Number(profile?.balance || 0)
    }
  } catch (e) {
    console.error('Failed loading bets', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadBets)
</script>

<template>
  <div style="max-width:900px;margin:2rem auto;padding:1rem">
    <h2>Dashboard</h2>
    <div style="margin-bottom:1rem">
      <router-link to="/create-bet">Create a Bet</router-link>
    </div>
    <div style="margin-bottom:1rem">Your balance: {{ balance }}</div>

    <div v-if="loading">Loading bets...</div>

    <ul v-else>
      <li v-for="b in bets" :key="b.id" style="margin-bottom:1rem;border:1px solid #eee;padding:1rem">
        <div><strong>{{ b.title }}</strong> — by {{ b.owner_email || 'unknown' }}</div>
        <div>{{ b.description }}</div>
        <div>Status: {{ b.approved ? 'Approved' : 'Pending' }}</div>
      </li>
    </ul>
  </div>
</template>
