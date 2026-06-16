<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function signIn() {
  errorMessage.value = ''
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error
    router.push({ name: 'Dashboard' })
  } catch (e) {
    errorMessage.value = e?.message ?? 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <h2>Log in</h2>

    <input v-model="email" placeholder="Email" type="email" autocomplete="email" />
    <input v-model="password" placeholder="Password" type="password" autocomplete="current-password" />

    <button :disabled="loading" @click="signIn">
      {{ loading ? 'Signing in...' : 'Sign in' }}
    </button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.auth { max-width: 420px; margin: 2rem auto; }
input { display:block; width:100%; margin: .5rem 0; padding:.5rem }
button { padding:.5rem 1rem }
</style>
