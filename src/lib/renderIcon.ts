import { h, type Component } from 'vue'
import { NIcon } from 'naive-ui'

export default (icon: Component) => () => h(NIcon, null, { default: () => h(icon) })
