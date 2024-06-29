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
            <div>
              Or enter
              <a :href="getParticipationUrl()" target="_blank">{{ getParticipationUrl() }}</a> in
              your browser
            </div>
          </template>
          <template #footer>
            <NButton :style="{ width: '100%' }" @click="handleDownloadQRCode()">Download</NButton>
          </template>
        </NModal>

        <NModal
          :show="showEmbeddingCode"
          :style="{ width: '600px' }"
          preset="card"
          @close="toggleEmebddingCodeShown"
        >
          <template #header
            >Embed this into your sli.dev presentation "{{ presentation.title }}"
          </template>
          <template #default>
            <pre
              >{{
                `

                    # interactive feedback
              &lt;PresentationWidget :presentationId="${presentation.id}" /&gt;

                                  `
              }}
            </pre>
          </template>
        </NModal>
      </NSpace>
    </template>
    <template #action>
      <NFlex justify="space-between">
        <NButtonGroup>
          <NButton v-if="showOpen" round @click="handlePresentationOpen()">
            {{ t('open_button') }}
          </NButton>
          <NButton
            v-if="showStartStop"
            :disabled="presentation.lc_status === 'started'"
            round
            @click="handleClickStart()"
          >
            <template #icon>
              <NIcon>
                <Play />
              </NIcon>
            </template>
            {{ presentation.lc_status === 'started' ? t('started_button') : t('start_button') }}
          </NButton>
          <NButton
            v-if="showStartStop"
            :disabled="presentation.lc_status !== 'started'"
            round
            @click="handleClickStop()"
          >
            <template #icon>
              <NIcon>
                <Stop />
              </NIcon>
            </template>
            {{ t('stop_button') }}
          </NButton>
        </NButtonGroup>
        <NButtonGroup>
          <NButton round @click="toggleQrCodeShown()">
            <template #icon>
              <NIcon>
                <QrCode />
              </NIcon>
            </template>
            QR-Code
          </NButton>
          <NButton v-if="showEmbedding" round @click="toggleEmebddingCodeShown()">
            <template #icon>
              <NIcon>
                <Code />
              </NIcon>
            </template>
            sli.dev Code
          </NButton>
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
import { Code, Play, QrCode, Stop } from '@vicons/carbon'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const showQrCode = ref(false)
const showEmbeddingCode = ref(false)

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  },
  showStartStop: {
    type: Boolean,
    default: true
  },
  showOpen: {
    type: Boolean,
    default: true
  },
  showEmbedding: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['started'])

const router = useRouter()
const { t } = useI18n()

const toggleQrCodeShown = () => {
  showQrCode.value = !showQrCode.value
}

const toggleEmebddingCodeShown = () => {
  showEmbeddingCode.value = !showEmbeddingCode.value
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

function handlePresentationOpen() {
  const { presentation } = props

  router.push({ name: 'presentation', params: { presentationId: presentation?.id } })
}

const getParticipationUrl = () =>
  window.location.origin + '/join?code=' + props.presentation?.join_code
</script>
