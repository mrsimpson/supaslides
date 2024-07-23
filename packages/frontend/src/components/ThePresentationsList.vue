<template>
  <n-space vertical>
    <n-card v-if="currentPresentation" :bordered="false" :title="t('current_presentation')">
      <n-card bordered embedded size="large">
        <PresentationFactsheet :presentation="currentPresentation" :show-start-stop="false" />
      </n-card>
    </n-card>
    <n-card
      :bordered="false"
      :title="nonCurrentPresentations.length > 0 ? t('other_presentations') : ' '"
    >
      <template #header-extra>
        <n-button
          data-testid="button-new-presentation"
          type="default"
          @click.prevent="() => router.push('/presentations/new')"
        >
          <template #icon>
            <PresentationFile />
          </template>
          {{ $t('create_presentation_button') }}
        </n-button>
      </template>
      <n-list v-for="presentation in nonCurrentPresentations" :key="presentation.id" bordered>
        <PresentationListItem :presentation="presentation" :show-start-stop="false" />
      </n-list>
    </n-card>
  </n-space>
</template>

<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import { usePresenterStore } from '@/stores/presenter'
import { storeToRefs } from 'pinia'
import PresentationListItem from '@/components/PresentationListItem.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PresentationFile } from '@vicons/carbon'

const presenterStore = usePresenterStore()
const { t } = useI18n()
const router = useRouter()
const { currentPresentation, nonCurrentPresentations } = storeToRefs(presenterStore)
</script>
