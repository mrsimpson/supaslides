<template>
  <NButton :disabled="debounced" size="large" @click="handleClick">{{ props.emoticon }}</NButton>
</template>

<script lang="ts" setup>
import { NButton, useMessage } from 'naive-ui'
import { useAudienceStore } from '@/stores/audience'
import handleError from '@/lib/handleErrorInComponent'
import { ref } from 'vue'
import * as emoji from 'node-emoji'

const message = useMessage()

const props = defineProps({
  emoticon: {
    type: String,
    required: true
  }
})

const debounced = ref(false)

const textRepresentation = () => emoji.which(props.emoticon)
const { react } = useAudienceStore()

function handleClick(e: Event) {
  e.preventDefault()
  const text = textRepresentation()
  if (text) {
    sendEmoji(props.emoticon, text)
  } else {
    console.error(props.emoticon, ' is an unknown emoji')
  }
}

function sendEmoji(emoticon: string, emojiTextRepresentation: string) {
  try {
    react(emoticon, emojiTextRepresentation)
    debounced.value = true
    message.success(props.emoticon)
    setTimeout(() => (debounced.value = false), 1000)
  } catch (e) {
    handleError(e, message)
  }
}
</script>
