<script setup>
import { ref } from 'vue'
import { supabase } from './lib/supabase'

const email = ref('')
const password = ref('')
const message = ref('')

async function signUp() {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Account created!'
  }
}

async function login() {
  const { error } =
    await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

  if (error) {
    message.value = error.message
  } else {
    message.value = 'Logged in!'
  }
}

async function logout() {
  await supabase.auth.signOut()
  message.value = 'Logged out!'
}
</script>

<template>
  <div>
    <h1>Supabase Auth</h1>

    <input
      v-model="email"
      type="email"
      placeholder="Email"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Password"
    />

    <button @click="signUp">
      Sign Up
    </button>

    <button @click="login">
      Login
    </button>

    <button @click="logout">
      Logout
    </button>

    <p>{{ message }}</p>
  </div>
</template>