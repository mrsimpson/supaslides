<template>
  <!--  <NDivider>Send a reaction whenever you feel like you need to!</NDivider>-->
  <NFlex v-if="isJoined()" size="large">
    <EmojiReaction emoticon="👍" />
    <EmojiReaction emoticon="❤️" />
    <EmojiReaction emoticon="🤘" />
    <EmojiReaction emoticon="👋" />
    <EmojiReaction emoticon="❓" />
    <EmojiReaction emoticon="😲" />
    <EmojiReaction emoticon="👎" />
  </NFlex>
</template>

<script lang="ts" setup>
import { NFlex } from 'naive-ui'
import EmojiReaction from '@/components/EmojiReaction.vue'
import type { PresentationPeek } from 'src/api/types/entities'

const props = defineProps({
  presentation: { type: Object as () => PresentationPeek, required: false }
})

function isJoined(): Boolean {
  return !!props.presentation
}
</script>
