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
            alert(error.message)
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form class="row flex-center flex" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
            <h1 class="header">Supabase + Vue 3</h1>
            <p class="description">Sign in via magic link with your email below</p>
            <div v-if="errorMessage" class="error-message" style="color: red; margin-bottom: 1rem;">
                {{ errorMessage }}
            </div>
            <div>
                <input class="inputField" type="email" placeholder="Your email" v-model="email" />
            </div>
            <div>
                <input type="submit" class="button block" :value="loading ? 'Loading' : 'Send magic link'"
                    :disabled="loading" />
            </div>
        </div>
    </form>
</template>