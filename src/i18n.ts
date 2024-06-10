import { createI18n } from 'vue-i18n'
import messages from '@/messages'

export const localeShort = navigator.language.substring(0, 2)

export default createI18n({
  locale: localeShort,
  fallbackLocale: 'en',
  allowComposition: true,
  messages
})
