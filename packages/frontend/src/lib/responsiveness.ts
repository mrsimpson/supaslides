import { ref } from 'vue'

const narrowScreenMql = window.matchMedia('(max-width: 640px)')
export const isNarrowScreen = ref(narrowScreenMql.matches)

narrowScreenMql.addEventListener('change', () => {
  isNarrowScreen.value = narrowScreenMql.matches
})
