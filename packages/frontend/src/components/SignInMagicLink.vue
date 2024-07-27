<template>
  <NCard title="Magic Link Signin" :bordered="false">
    <NForm inline ref="formRef" :model="formValue" :rules="rules" @submit="handleMagicLinkSignin">
      <NFormItem label="E-mail" path="email">
        <NInput v-model:value="formValue.email" placeholder="your email"/>
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
import {ref} from 'vue'
import type {FormInst} from 'naive-ui'
import {NButton, NCard, NForm, NFormItem, NInput, useMessage} from 'naive-ui'
import {useUserSessionStore} from "@/stores/userSession";

const loading = ref(false)
const {signInWithMagicLink} = useUserSessionStore()

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
  loading.value = true
  const error = await signInWithMagicLink(formValue.value.email)
  if (error) {
    message.error(error.message)
  } else {
    message.success('Check your email for the login link!')
  }
  loading.value = false
}
</script>
