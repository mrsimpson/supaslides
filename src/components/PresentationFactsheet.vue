<template>
  <NThing
    :id="'presentation-' + presentation.id"
    :description="presentation.description || ''"
    :title="presentation?.title || 'untitled presentation'"
  >
    <template #default>
      <NSpace vertical>
        <NModal
          :show="showQrCode"
          :style="{ width: '600px' }"
          preset="card"
          @close="toggleQrCodeShown"
        >
          <template #header>QR Code to join "{{ presentation.title }}"</template>
          <template #default>
            <NQrCode
              :size="500"
              :style="{ cursor: 'zoom-in', padding: 0 }"
              :value="getParticipationUrl()"
              @click="toggleQrCodeShown()"
            />
          </template>
          <template #footer>
            <NButton :style="{ width: '100%' }" @click="handleDownloadQRCode()">Download</NButton>
          </template>
        </NModal>
      </NSpace>
    </template>
    <template #action>
      <NFlex justify="space-between">
        <NButtonGroup>
          <NButton
            :disabled="presentation.lc_status === 'started'"
            round
            @click="handleClickStart()"
          >
            <template #icon>
              <NIcon>
                <Play />
              </NIcon>
            </template>
            {{ presentation.lc_status === 'started' ? 'Started' : 'Start' }}
          </NButton>
          <NButton
            :disabled="presentation.lc_status !== 'started'"
            round
            @click="handleClickStop()"
          >
            <template #icon>
              <NIcon>
                <Stop />
              </NIcon>
            </template>
            Stop
          </NButton>
        </NButtonGroup>
        <NButtonGroup>
          <NButton round @click="toggleQrCodeShown()">QR-Code</NButton>
        </NButtonGroup>
      </NFlex>
    </template>
  </NThing>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import { NButton, NButtonGroup, NFlex, NIcon, NModal, NQrCode, NSpace, NThing } from 'naive-ui'
import slug from '@/lib/slug'
import type { Presentation } from '@/types/entities'
import { usePresenterStore } from '@/stores/presenter'
import { Play, Stop } from '@vicons/carbon'

const showQrCode = ref(false)

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  }
})

const emit = defineEmits(['started'])

const toggleQrCodeShown = () => {
  showQrCode.value = !showQrCode.value
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
