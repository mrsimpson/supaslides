<template>
  <n-form ref="formRef" :model="formValue" inline @submit.prevent="sendBroadcast">
    <n-form-item class="form-input" path="message">
      <n-input
        v-model:value="formValue.message"
        :placeholder="t('broadcast_placeholder')"
        data-testid="input-send-broadcast"
      />
    </n-form-item>
    <n-form-item class="form-button">
      <n-button data-testid="button-send-broadcast" @click.prevent="sendBroadcast">
        <template #icon>
          <n-icon>
            <Send />
          </n-icon>
        </template>
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { Presentation } from 'src/api/types/entities'
import { ref } from 'vue'
import { type FormInst, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { usePresenterStore } from '@/stores/presenter'
import handleError from '@/lib/handleErrorInComponent'
import { Send } from '@vicons/carbon'

const props = defineProps({
  presentation: { type: Object as () => Presentation, required: false }
})

const message = useMessage()
const { t } = useI18n()
const formRef = ref<FormInst | null>(null)
const formValue = ref({ message: '' as string | null })
const { broadcast } = usePresenterStore()

async function sendBroadcast(e: Event) {
  e.preventDefault()
  if (props.presentation && formValue.value.message) {
    try {
      await broadcast(props.presentation.id, formValue.value.message)
      formValue.value.message = ''
      message.success(t('comment_sent_success'))
    } catch (e) {
      handleError(e, message)
    }
  }
}
</script>

<style scoped>
.n-form {
  display: flex;
}

.form-input {
  flex: 1;
}

.form-button {
  width: auto;
}
</style>
