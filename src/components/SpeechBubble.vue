<!-- SpeechBubble.vue -->
<template>
  <div :class="['speech-bubble', calloutPositionClass]" :style="[defaultStyles, style]">
    <slot></slot>
    <span
      :class="['speech-bubble-tail', calloutPositionClass]"
      :style="[tailStyle, tailCustomStyle]"
    ></span>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { useThemeVars } from 'naive-ui'

interface StyleObject {
  [key: string]: string | number
}

const props = defineProps<{
  style?: StyleObject
  calloutPosition: 'left' | 'right'
}>()

const defaultStyles = {
  backgroundColor: useThemeVars().value.primaryColor,
  color: 'white'
}

const calloutPositionClass = computed(() => {
  return props.calloutPosition === 'right' ? 'callout-right' : 'callout-left'
})

const tailStyle = computed(() => {
  return props.calloutPosition === 'right'
    ? {
        borderColor: `transparent transparent transparent ${defaultStyles.backgroundColor}`,
        right: '-10px',
        left: 'auto'
      }
    : {
        borderColor: `transparent ${defaultStyles.backgroundColor} transparent transparent`,
        left: '-10px',
        right: 'auto'
      }
})

const tailCustomStyle = computed(() => {
  if (!props.style || !props.style.backgroundColor) return {}
  return props.calloutPosition === 'right'
    ? {
        borderColor: `transparent transparent transparent ${props.style.backgroundColor}`
      }
    : {
        borderColor: `transparent ${props.style.backgroundColor} transparent transparent`
      }
})
</script>

<style scoped>
.speech-bubble {
  position: relative;
  border-radius: 5px;
  padding: 15px;
}

.speech-bubble-tail {
  content: '';
  position: absolute;
  border-style: solid;
  border-width: 10px 10px 10px 0;
  display: block;
  width: 0;
  z-index: 1;
  top: 10px;
}

.callout-left .speech-bubble-tail {
  border-width: 10px 10px 10px 0;
}

.callout-right .speech-bubble-tail {
  border-width: 10px 0 10px 10px;
}
</style>
