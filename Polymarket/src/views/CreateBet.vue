<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuth } from '@/composables/useAuth'

const title = ref('')
const description = ref('')
const amount = ref(100)
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const { user } = useAuth()

async function submitBet() {
  errorMessage.value = ''
  loading.value = true
  try {
    const owner = user.value
    if (!owner) throw new Error('Must be logged in to submit a bet')

    // fetch current balance
    const { data: profile, error: pErr } = await supabase.from('profiles').select('balance').eq('id', owner.id).single()
    if (pErr) throw pErr
    const currentBalance = Number(profile?.balance || 0)
    const betAmount = Number(amount.value || 0)
    if (betAmount <= 0) throw new Error('Amount must be greater than 0')
    if (betAmount > currentBalance) throw new Error('Insufficient balance')

    // insert bet
    const { data: inserted, error: insertErr } = await supabase.from('bets').insert([{
      title: title.value,
      description: description.value,
      creator_id: owner.id,
      amount: betAmount
    }]).select().single()
    if (insertErr) throw insertErr

    // deduct balance (non-atomic: prefer a DB function for atomicity)
    const newBalance = currentBalance - betAmount
    const { error: updErr } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', owner.id)
    if (updErr) {
      // attempt to clean up inserted bet
      await supabase.from('bets').delete().eq('id', inserted.id)
      throw updErr
    }

    router.push({ name: 'Dashboard' })
  } catch (e) {
    errorMessage.value = e?.message ?? 'Failed to create bet.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width:700px;margin:2rem auto">
    <h2>Create a Bet</h2>
    <div v-if="errorMessage" style="color:red">{{ errorMessage }}</div>
    <input v-model="title" placeholder="Short title" />
    <textarea v-model="description" placeholder="Describe the bet" rows="6"></textarea>
  <input v-model.number="amount" placeholder="Amount" type="number" min="0" />
    <div style="margin-top:1rem">
      <button :disabled="loading" @click="submitBet">{{ loading ? 'Submitting...' : 'Submit Bet' }}</button>
    </div>
  </div>
</template>

<style scoped>
input, textarea { width:100%; padding:.5rem; margin:.5rem 0 }
</style>
