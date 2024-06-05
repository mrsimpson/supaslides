<template>
  <NThing
    :id="'presentation-' + presentation.id"
    :title="presentation?.title || 'untitled presentation'"
  >
    <template #header-extra>
      <NSpace vertical>
        <NQrCode
          :size="qrCodeZoomed ? 200 : 40"
          :style="{ cursor: 'zoom-in', padding: 0 }"
          :value="getParticipationUrl()"
          @click="toggleQrZoom()"
        />

        <NButton v-if="qrCodeZoomed" :style="{ width: '100%' }" @click="handleDownloadQRCode()">
          Download
        </NButton>
      </NSpace>
    </template>
    <template #action>
      <NButtonGroup>
        <NButton :disabled="presentation.lc_status === 'started'" @click="handleClickStart()"
          >{{ presentation.lc_status === 'started' ? 'Started' : 'Start' }}
        </NButton>
        <NButton :disabled="presentation.lc_status !== 'started'" @click="handleClickStop()"
          >Stop
        </NButton>
      </NButtonGroup>
    </template>
  </NThing>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import { NButton, NButtonGroup, NQrCode, NSpace, NThing } from 'naive-ui'
import slug from '@/lib/slug'
import type { Presentation } from '@/types/entities'
import { usePresenterStore } from '@/stores/presenter'

const qrCodeZoomed = ref(false)

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  }
})

const emit = defineEmits(['started'])

const toggleQrZoom = () => {
  qrCodeZoomed.value = !qrCodeZoomed.value
}

const handleDownloadQRCode = () => {
  const { presentation } = props
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

const handleClickStart = async () => {
  await usePresenterStore().startPresentation(props.presentation.id)
}

const handleClickStop = async () => {
  await usePresenterStore().stopPresentation(props.presentation.id)
}

const getParticipationUrl = () =>
  window.location.origin + '/feedback?presentation=' + props.presentation.id
</script>
