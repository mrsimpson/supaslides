<template>
  <n-card :bordered="false" :title="t('create_new_presentation')">
    <n-form ref="formRef" :model="formValue" :rules="rules" @submit.prevent="handleSubmit">
      <n-form-item :label="t('presentation_title')" path="title">
        <n-input
          v-model:value="formValue.title"
          :autofocus="true"
          :placeholder="t('presentation_title_label')"
          data-testid="input-presentation-title"
        />
      </n-form-item>
      <n-form-item :label="t('presentation_description_label')" path="description">
        <n-input
          v-model:value="formValue.description"
          :autosize="{ minRows: 5 }"
          :placeholder="t('presentation_description_placeholder')"
          data-testid="input-presentation-description"
          type="textarea"
        />
      </n-form-item>
      <n-form-item>
        <n-button
          :disabled="!formValue.title"
          data-testid="button-create-presentation"
          @click.prevent="handleSubmit"
          >{{ t('Create') }}
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { usePresenterStore } from '@/stores/presenter'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { type FormInst, useMessage } from 'naive-ui'
import type { CreatePresentation } from '@/api/types/entities'
import { useRouter } from 'vue-router'

const { createPresentation, setActivePresentation } = usePresenterStore()

const { t } = useI18n()
const router = useRouter()

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref({
  title: '' as string | null,
  description: '' as string | null
} as CreatePresentation)

const rules = {
  title: {
    required: true,
    message: t('please_enter_presentation_title'),
    trigger: ['input', 'blur']
  },
  description: {
    required: false
  }
}

async function handleSubmit() {
  const newPresentation = await createPresentation(formValue.value)
  await router.push(`/presentations/${newPresentation?.id}`)
}
</script>
