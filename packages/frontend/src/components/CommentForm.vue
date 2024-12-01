<template>
  <n-form ref="formRef" :model="formValue" inline @submit="sendComment">
    <n-form-item class="form-input" path="commentText">
      <n-input
          v-model:value="formValue.commentText"
          :placeholder="t('comment_placeholder')"
          data-testid="input-comment"
      />
    </n-form-item>
    <n-form-item class="form-button">
      <n-button :disabled="debounced" @click="sendComment" data-testid="button-comment-send">
        <template #icon>
          <n-icon>
            <Send/>
          </n-icon>
        </template>
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type {PresentationPeek} from 'src/api/types/entities'
import {ref} from 'vue'
import {type FormInst, useMessage} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {useAudienceStore} from '@/stores/audience'
import handleError from '@/lib/handleErrorInComponent'
import {Send} from '@vicons/carbon'

defineProps({
  presentation: {type: Object as () => PresentationPeek, required: false}
})

const message = useMessage()
const debounced = ref(false)
const {t} = useI18n()
const formRef = ref<FormInst | null>(null)
const formValue = ref({commentText: '' as string | null})
const {comment} = useAudienceStore()

function sendComment(e: Event) {
  e.preventDefault()
  if (debounced.value) {
    message.error(t('comment_debounced_error'))
    return
  }
  if (formValue.value.commentText) {
    try {
      comment(formValue.value.commentText)
      formValue.value.commentText = ''
      debounced.value = true
      message.success(t('comment_sent_success'))
      setTimeout(() => (debounced.value = false), 1000)
    } catch (e) {
      handleError(e, message)
    }
  }
}
</script>

<style scoped>

.form-input {
  flex: 1;
}

.form-button {
  width: auto;
}
</style>
