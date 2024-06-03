<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { NAvatar } from 'naive-ui'

const prop = defineProps<{ path: string | null }>()
const { path } = toRefs(prop)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error downloading image: ', error.message)
    } else {
      console.error('An unexpected error occurred:', error)
    }
  }
}

const uploadAvatar = async (evt: Event) => {
  const input = evt.target as HTMLInputElement
  files.value = input.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

    if (uploadError) throw uploadError
    emit('update:path', filePath)
    emit('upload')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    } else {
      console.error('An unexpected error occurred:', error)
    }
  } finally {
    uploading.value = false
  }
}

watch(path, () => {
  if (path.value) downloadImage()
})
</script>

<template>
  <div>
    <NAvatar v-if="src" :src="src" size="large" alt="Avatar" />
    <NAvatar v-else size="large" alt="Avatar">A</NAvatar>

    <div>
      <label class="button primary block" for="single">
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </label>
      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>
