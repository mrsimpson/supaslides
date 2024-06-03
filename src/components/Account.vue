<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import { onMounted, ref, toRefs } from 'vue'
import Avatar from '@/components/Avatar.vue'
import router from '@/router'
import { userSessionStore } from '@/stores/userSession'
import { NButton, NFormItem, NInput, NForm, NCard } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'

const loading = ref(true)
const { session } = userSessionStore()

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref({
  username: '' as string | null,
  website: '' as string | null,
  avatar_url: '' as string | null
})

const rules = {
  email: {
    required: true,
    message: 'Please enter your email',
    trigger: ['input']
  },
  username: { required: false },
  website: { required: false },
  avatar_url: { required: false }
}

onMounted(() => {
  getProfile()
})

async function getProfile() {
  if (!session || !session.user) {
    return
  }
  const { user } = session

  try {
    loading.value = true

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      formValue.value = data
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message)
    } else {
      console.error('An unexpected error occurred:', error)
    }
  } finally {
    loading.value = false
  }
}

async function updateProfile(e: Event) {
  try {
    if (session && session.user) {
      loading.value = true
      const { user } = session

      const updates = {
        id: user.id,
        username: formValue.value.username,
        website: formValue.value.website,
        avatar_url: formValue.value.avatar_url,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error
      message.success('Profile updated')
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    } else {
      console.error('An unexpected error occurred:', error)
    }
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    } else {
      console.error('An unexpected error occurred:', error)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NCard title="Account" :bordered="false">
    <NForm @submit="updateProfile">
      <!--      <Avatar :path="formValue.avatar_url" @upload="updateProfile" />-->

      <NFormItem>
        <NInput id="email" label="Email" type="text" :value="session?.user.email" readonly />
      </NFormItem>
      <NFormItem>
        <NInput
          id="username"
          placeholder="Enter your username"
          label="Username"
          type="text"
          v-model:value="formValue.username"
        />
      </NFormItem>
      <NFormItem>
        <NInput
          id="website"
          placeholder="Enter your website URL"
          label="Website"
          type="text"
          v-model:value="formValue.website"
        />
      </NFormItem>
      <NFormItem>
        <NButton @click="updateProfile" :disabled="loading">Update</NButton>
      </NFormItem>
    </NForm>

    <NFormItem>
      <NButton type="error" @click="signOut">Sign Out</NButton>
    </NFormItem>
  </NCard>
</template>
