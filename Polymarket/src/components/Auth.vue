<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const email = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
    try {
        errorMessage.value = ''
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({ email: email.value })
        if (error) throw error
        alert('Check your email for the login link!')
    } catch (error) {
        console.error('Auth error:', error)
        if (error instanceof Error) {
            errorMessage.value = error.message
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form class="row flex-center flex" @submit.prevent="handleLogin">
        <div class="col-6 form-widget card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
                        <div>
                            <h1 class="header">Supabase + Vue 3</h1>
                            <p class="description">Sign in with email and password</p>
                        </div>
                    </div>

            <div v-if="errorMessage" class="error-message" style="color: var(--danger); margin-bottom: 1rem;">
                {{ errorMessage }}
            </div>

            <div class="inputs">
                <input class="inputField input" type="email" placeholder="Your email" v-model="email" />
            </div>

            <div>
                <input type="submit" class="button block" :value="loading ? 'Loading' : 'Send magic link'" :disabled="loading" />
            </div>
        </div>
    </form>
</template>

<style scoped>
.inputs { margin-bottom: 1rem; display:flex; flex-direction:column; width:100% }
.inputField { padding:0.5rem; margin-bottom:0.5rem; border:1px solid rgba(255,255,255,0.03); border-radius:8px; background:transparent; color:inherit }
.button.secondary { margin-left:0; }
</style>