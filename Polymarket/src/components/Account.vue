<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import Avatar from './Avatar.vue'

const props = defineProps(['claims'])
const { claims } = toRefs(props)

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')
const errorMessage = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    errorMessage.value = ''
    loading.value = true
    const userId = claims.value?.id
    
    if (!userId) {
      throw new Error('No user ID found')
    }
    
    console.log('Fetching profile for user:', userId)
    let { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', userId)
      .single()

    if (error && status !== 406) {
      console.error('Profile fetch error:', error)
      throw error
    }

    if (data) {
      username.value = data.username || ''
      website.value = data.website || ''
      avatar_url.value = data.avatar_url || ''
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    if (error instanceof Error) {
      errorMessage.value = `Error loading profile: ${error.message}`
      alert(errorMessage.value)
    }
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    errorMessage.value = ''
    loading.value = true
    const userId = claims.value?.id
    
    if (!userId) {
      throw new Error('No user ID found')
    }
    
    const updates = {
      id: userId,
      username: username.value,
      website: website.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    }

    console.log('Updating profile with:', updates)
    let { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      console.error('Profile update error:', error)
      throw error
    }
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error instanceof Error) {
      errorMessage.value = `Error updating profile: ${error.message}`
      alert(errorMessage.value)
    }
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    let { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div v-if="errorMessage" class="error-message" style="color: red; margin-bottom: 1rem;">
      {{ errorMessage }}
    </div>
    <Avatar v-model:path="avatar_url" @upload="updateProfile" :size="10" />
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="claims.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="url" v-model="website" />
    </div>

    <div>
      <input type="submit" class="button primary block" :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading" />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>