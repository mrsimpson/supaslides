<script lang="ts" setup>
import { supabase } from '@/lib/supabase'
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useUserSessionStore } from '@/stores/userSession'
import type { FormInst } from 'naive-ui'
import { NButton, NCard, NForm, NFormItem, NInput, useMessage } from 'naive-ui'

const loading = ref(true)
const { session } = useUserSessionStore()

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref({
  username: '' as string | null,
  website: '' as string | null,
  avatar_url: '' as string | null
})

const rules = {
  username: { required: true, message: 'Please enter a username', trigger: ['input'] },
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
  e.preventDefault()
  const valid = await formRef.value?.validate()
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
      message.error(error.message)
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
  <NCard :bordered="false" title="Account">
    <NForm ref="formRef" :model="formValue" :rules="rules" @submit="updateProfile">
      <!--      <Avatar :path="formValue.avatar_url" @upload="updateProfile" />-->

      <NFormItem label="Email">
        <NInput id="email" :value="session?.user.email" disabled type="text" />
      </NFormItem>
      <NFormItem label="Username" path="username">
        <NInput
          id="username"
          v-model:value="formValue.username"
          placeholder="Enter your username"
          type="text"
        />
      </NFormItem>
      <NFormItem label="Website" path="website">
        <NInput
          id="website"
          v-model:value="formValue.website"
          placeholder="Enter your website URL"
          type="text"
        />
      </NFormItem>
      <NFormItem>
        <NButton :disabled="loading" @click="updateProfile">Update</NButton>
      </NFormItem>
    </NForm>

    <NFormItem>
      <NButton type="error" @click="signOut">Sign Out</NButton>
    </NFormItem>
  </NCard>
</template>
