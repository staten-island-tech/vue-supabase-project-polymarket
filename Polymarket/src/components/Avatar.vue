<template>
  <div class="avatar-container">
    <img v-if="path" :src="path" :alt="alt" :style="{ width: size + 'rem', height: size + 'rem' }" class="avatar" />
    <div v-else :style="{ width: size + 'rem', height: size + 'rem' }" class="avatar-placeholder">
      {{ alt || 'Avatar' }}
    </div>
    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />
    <button @click="triggerFileInput" class="upload-button">Upload</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

defineProps({
  path: String,
  size: {
    type: Number,
    default: 5
  },
  alt: String
})

const emit = defineEmits(['update:path', 'upload'])

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('update:path', URL.createObjectURL(file))
    emit('upload', file)
  }
}
</script>

<style scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.upload-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-button:hover {
  background-color: #0056b3;
}
</style>