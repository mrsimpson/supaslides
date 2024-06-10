<template>
  <!--  <NDivider>Send a reaction whenever you feel like you need to!</NDivider>-->
  <NFlex v-if="isJoined()" size="large">
    <EmojiReaction emoticon="👍" text-representation="thumbs up" />
    <EmojiReaction emoticon="❤️" text-representation="heart" />
    <EmojiReaction emoticon="🤘" text-representation="you rock" />
    <EmojiReaction emoticon="👋" text-representation="wave" />
    <EmojiReaction emoticon="❓" text-representation="question" />
    <EmojiReaction emoticon="😲" text-representation="surprised" />
    <EmojiReaction emoticon="👎" text-representation="thumbs down" />
  </NFlex>
</template>

<script lang="ts" setup>
import { NFlex } from 'naive-ui'
import EmojiReaction from '@/components/EmojiReaction.vue'
import type { PresentationPeek } from '@/types/entities'

const props = defineProps({
  presentation: { type: Object as () => PresentationPeek, required: false }
})

function isJoined(): Boolean {
  return !!props.presentation
}
</script>
