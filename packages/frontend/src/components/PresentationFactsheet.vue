<template>
  <n-thing
    :id="'presentation-' + presentation.id"
    :description="presentation.description || ''"
    :title="presentation?.title || 'untitled presentation'"
    data-testid="thing-presentation-factsheet"
  >
    <template #default>
      <n-space vertical>
        <n-modal
          :show="showQrCode"
          :style="{ width: '600px' }"
          preset="card"
          @close="toggleQrCodeShown"
        >
          <template #header>QR Code to join "{{ presentation.title }}"</template>
          <template #default>
            <n-qr-code
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
            <n-button :style="{ width: '100%' }" @click="handleDownloadQRCode()">Download</n-button>
          </template>
        </n-modal>

        <n-modal
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
        </n-modal>
      </n-space>
    </template>
    <template #header-extra>
      <n-button
        :bordered="false"
        data-testid="button-delete-presentation"
        @click.prevent="handleDelete"
      >
        <!-- we just want this button for being able to teardown in tests.
        Visibility hidden is not accessible to playwright though, so just create an empty button.
        It could look like the following -->
        <!--        {{ $t('Delete') }}-->
        <!--        <template #icon>-->
        <!--          <TrashCan />-->
        <!--        </template>-->
      </n-button>
    </template>
    <template #action>
      <n-flex justify="space-between">
        <n-button-group>
          <n-button
            v-if="showOpen"
            data-testid="button-open-presentation"
            round
            @click="handlePresentationOpen()"
          >
            {{ t('open_button') }}
          </n-button>
          <n-button
            v-if="showStartStop"
            :disabled="presentation.lc_status === 'started'"
            data-testid="button-start-presentation"
            round
            @click="handleClickStart()"
          >
            <template #icon>
              <n-icon>
                <Play />
              </n-icon>
            </template>
            {{ presentation.lc_status === 'started' ? t('started_button') : t('start_button') }}
          </n-button>
          <n-button
            v-if="showStartStop"
            :disabled="presentation.lc_status !== 'started'"
            data-testid="button-stop-presentation"
            round
            @click="handleClickStop()"
          >
            <template #icon>
              <n-icon>
                <Stop />
              </n-icon>
            </template>
            {{ t('stop_button') }}
          </n-button>
        </n-button-group>

        <n-button-group>
          <n-button data-testid="button-qrcode" round @click="toggleQrCodeShown()">
            <template #icon>
              <n-icon>
                <QrCode />
              </n-icon>
            </template>
            QR-Code
          </n-button>
          <n-button
            v-if="showEmbedding"
            data-testid="button-embed"
            round
            @click="toggleEmebddingCodeShown()"
          >
            <template #icon>
              <n-icon>
                <Code />
              </n-icon>
            </template>
            sli.dev Code
          </n-button>
        </n-button-group>
      </n-flex>
    </template>
  </n-thing>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'
import slug from '@/lib/slug'
import type { Presentation } from 'src/api/types/entities'
import { usePresenterStore } from '@/stores/presenter'
import { Code, Play, QrCode, Stop } from '@vicons/carbon'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

const showQrCode = ref(false)
const showEmbeddingCode = ref(false)
const { startPresentation, stopPresentation, deletePresentation } = usePresenterStore()

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
const message = useMessage()

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

const handleDelete = async () => {
  const deleted = await deletePresentation(props.presentation.id)
  if (deleted) {
    message.success(t('presentation_delete_success_message'))
    await router.push('/presentations')
  } else {
    message.error(t('presentation_delete_error_message'))
  }
}

const handleClickStart = async () => {
  await startPresentation(props.presentation.id)
}

const handleClickStop = async () => {
  await stopPresentation(props.presentation.id)
}

function handlePresentationOpen() {
  const { presentation } = props

  router.push({ name: 'presentation', params: { presentationId: presentation?.id } })
}

const getParticipationUrl = () =>
  window.location.origin + '/join?code=' + props.presentation?.join_code
</script>
