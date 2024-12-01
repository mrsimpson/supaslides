<template>
  <p v-if="!isEditMode">
    {{ t('you_are_participating_as') }}
    <a @click="setEditMode">{{ displayName }}</a>
  </p>
  <n-form
    v-else
    ref="formRef"
    :label-placement="'top'"
    :model="formValue"
    :rules="rules"
    inline
    @submit="updateDisplayName"
  >
    <n-form-item
      :label="t('update_display_name_label')"
      :style="{ minWidth: '30rem' }"
      path="displayName"
    >
      <n-input
        v-model:value="formValue.displayName"
        :placeholder="t('your_display_name_placeholder')"
        data-testid="input-display-name"
      />
    </n-form-item>
    <n-form-item>
      <n-button @click="updateDisplayName">
        <template #icon>
          <n-icon>
            <CheckmarkOutline />
          </n-icon>
        </template>
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useUserSessionStore } from '@/stores/userSession'
import { CheckmarkOutline } from '@vicons/carbon'
import { onMounted, ref } from 'vue'
import { type FormInst, useThemeVars } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const formRef = ref<FormInst | null>(null)
const formValue = ref({ displayName: '' as string | null })
const rules = {
  displayName: {
    required: true,
    message: () => t('you_need_to_provide_a_name_message'),
    trigger: ['input', 'blur']
  }
}
const { displayName } = storeToRefs(useUserSessionStore())
const { setDisplayName } = useUserSessionStore()

const isEditMode = ref(false)
useThemeVars()

onMounted(async () => {
  if (!displayName.value) {
    isEditMode.value = true
  } else {
    formValue.value.displayName = displayName.value
  }
})

function setEditMode() {
  isEditMode.value = true
}

async function updateDisplayName(ev: Event) {
  ev.preventDefault()
  try {
    await formRef.value?.validate()
    if (formValue.value.displayName) {
      setDisplayName(formValue.value.displayName)
      isEditMode.value = false
    }
  } catch (errors) {
    //do nothing – validation is shown at form item //messageValidationError(message, errors)
  }
}
</script>
