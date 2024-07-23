<template>
  <n-card :bordered="false" :title="t('account')">
    <n-form ref="formRef" :model="formValue" :rules="rules" @submit="updateProfile">
      <!-- <Avatar :path="formValue.avatar_url" @upload="updateProfile" />-->
      <n-form-item :label="t('email_label')">
        <NInput
          id="email"
          :value="session?.user.email"
          data-testid="input-account-email"
          disabled
          type="text"
        />
      </n-form-item>
      <n-form-item :label="t('username_label')" path="username">
        <n-input
          id="username"
          v-model:value="formValue.username"
          data-testid="input-account-username"
          placeholder="Enter your username"
          type="text"
        />
      </n-form-item>
      <n-form-item :label="t('website_label')" path="website">
        <n-input
          id="website"
          v-model:value="formValue.website"
          data-testid="input-account-website"
          placeholder="Enter your website URL"
          type="text"
        />
      </n-form-item>
      <n-form-item>
        <n-button
          :disabled="loading"
          data-testid="button-account-updateProfile"
          @click.prevent="updateProfile"
        >
          {{
          t('update_button')
        }}
        </n-button>
      </n-form-item>
    </n-form>
    <n-form-item>
      <n-button data-testid="button-account-signOut" type="error" @click="signOut">{{
        t('sign_out_button')
      }}</n-button>
    </n-form-item>
  </n-card>
</template>

<script lang="ts" setup>
import { supabase } from '@/lib/supabase'
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useUserSessionStore } from '@/stores/userSession'
import { type FormInst, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const loading = ref(true)
const { session } = useUserSessionStore()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref({
  username: '' as string | null,
  website: '' as string | null,
  avatar_url: '' as string | null
})

const { t } = useI18n()

const rules = {
  username: {
    required: true,
    message: t('please_enter_username_message'),
    trigger: ['input']
  },
  website: {
    required: false
  },
  avatar_url: {
    required: false
  }
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

      message.success(t('profile_updated_message'))
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
