<template>
  <n-avatar :style="{ color, backgroundColor }" round size="small"
    >{{ getInitials(name) }}
  </n-avatar>
</template>
<script lang="ts" setup>
import { getColorsForName } from '@/lib/colors'

const props = defineProps({ name: { type: String } })

const { color: backgroundColor, contrastingColor: color } = getColorsForName(
  props.name || 'anonymous',
  10
)

function getInitials(name?: string): string {
  if (!name) return ''

  // Split the name into parts by spaces
  const nameParts = name.trim().split(/\s+/)

  // Get the first letter of each part
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase())

  // Join the initials and limit to three characters
  return initials.join('').substring(0, 3)
}
</script>
