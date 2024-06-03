<template>
  <NCard title="Magic Link Signin" :bordered="false">
    <NForm inline ref="formRef" :model="formValue" :rules="rules" @submit="handleMagicLinkSignin">
      <NFormItem label="E-mail" path="email">
        <NInput v-model:value="formValue.email" placeholder="your email" />
      </NFormItem>
      <NFormItem>
        <NButton @click="handleMagicLinkSignin" :loading="loading" :disabled="loading"
          >{{ loading ? 'Loading' : 'Send magic link' }}
        </NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NFormItem, NInput, NForm, NCard } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { supabase } from '@/lib/supabase'

const loading = ref(false)

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref({
  email: ''
})
const rules = {
  email: {
    required: true,
    message: 'Please enter your email',
    trigger: ['input']
  }
}

const handleMagicLinkSignin = async (e: Event) => {
  e.preventDefault()
  await formRef.value?.validate()
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: formValue.value.email
    })
    if (error) throw error
    message.success('Check your email for the login link!')
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
