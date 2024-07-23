import { ref } from "vue"

const smallScreenMql = window.matchMedia('(max-width: 640px)')
export const isSmallScreen = ref(smallScreenMql.matches)

smallScreenMql.addEventListener('change',
    () => {
        isSmallScreen.value = smallScreenMql.matches
    })
