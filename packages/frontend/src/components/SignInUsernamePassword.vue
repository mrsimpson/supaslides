<template>
  <NCard :bordered="false" title="Signin for registered users">
    <NForm ref="formRef" :model="formValue" :rules="rules" inline @submit="handleSignin">
      <NFormItem label="E-mail" path="email">
        <NInput
          v-model:value="formValue.email"
          data-testid="input-signin-email"
          placeholder="your email"
        />
      </NFormItem>
      <NFormItem label="Password" path="password">
        <NInput
          v-model:value="formValue.password"
          data-testid="input-signin-password"
          placeholder="your password"
          type="password"
        />
      </NFormItem>
      <NFormItem>
        <NButton
          :disabled="loading"
          :loading="loading"
          data-testid="button-signin-submit"
          @click="handleSignin"
          >{{ loading ? 'Loading' : 'Submit' }}
        </NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NCard, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
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
