<template>
  <NThing
    :id="'presentation-' + presentation.id"
    :title="presentation?.title || 'untitled presentation'"
  >
    <template #header-extra>
      <NSpace vertical>
        <NQrCode
          :size="qrCodeZoomed ? 200 : 40"
          :style="{
            cursor: 'zoom-in',
            padding: 0
          }"
          :value="getParticipationUrl()"
          @click="toggleQrZoom()"
        />
        <NButton
          v-if="qrCodeZoomed"
          :style="{ width: '100%' }"
          @click="handleDownloadQRCode(presentation)"
        >
          Download
        </NButton>
      </NSpace>
    </template>
  </NThing>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import { NButton, NQrCode, NSpace, NThing } from 'naive-ui'
import type { Presentation } from '@/types/entities.js'
import slug from '@/lib/slug'

const qrCodeZoomed = ref(false)

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  }
})

const toggleQrZoom = () => {
  qrCodeZoomed.value = !qrCodeZoomed.value
}

const handleDownloadQRCode = (presentation: Presentation) => {
  const canvas = document
    .querySelector(`#presentation-${presentation.id} .n-qr-code`)
    ?.querySelector<HTMLCanvasElement>('canvas')
  if (canvas) {
    const url = canvas.toDataURL()
    const a = document.createElement('a')
    a.download = `QRCode${presentation.title ? '-' + slug(presentation.title) : ''}-${presentation.id}.png`
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  return {
    handleDownloadQRCode
  }
}

const getParticipationUrl = () =>
  window.location.origin + '/feedback?presentation=' + props.presentation?.id
</script>
