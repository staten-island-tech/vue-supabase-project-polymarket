<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuth } from '@/composables/useAuth'

const title = ref('')
const description = ref('')
const amount = ref(0)
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

    // perform transaction: insert bet and deduct balance
    const { error: txError } = await supabase.rpc('insert_bet_and_deduct', {
      p_title: title.value,
      p_description: description.value,
      p_owner_id: owner.id,
      p_owner_email: owner.email,
      p_amount: betAmount
    })
    if (txError) throw txError

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
