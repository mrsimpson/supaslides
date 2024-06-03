<template>
  <NCard title="Signin for registered users" :bordered="false">
    <NForm inline ref="formRef" :model="formValue" :rules="rules" @submit="handleSignin">
      <NFormItem label="E-mail" path="email">
        <NInput v-model:value="formValue.email" placeholder="your email" />
      </NFormItem>
      <NFormItem label="Password" path="password">
        <NInput v-model:value="formValue.password" type="password" placeholder="your password" />
      </NFormItem>
      <NFormItem>
        <NButton @click="handleSignin" :loading="loading" :disabled="loading"
          >{{ loading ? 'Loading' : 'Submit' }}
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
  email: '',
  password: ''
})
const rules = {
  email: {
    required: true,
    message: 'Please enter your email',
    trigger: ['input']
  },
  password: {
    required: true,
    message: 'Please enter your password',
    trigger: ['input']
  }
}

const handleSignin = async (e: Event) => {
  e.preventDefault()
  await formRef.value?.validate()
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: formValue.value.email,
      password: formValue.value.password
    })
    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
