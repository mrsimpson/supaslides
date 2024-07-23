import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'

export default function handleError(e: any, message: MessageApiInjection) {
  if (e instanceof Error) {
    message.error(e.message)
  } else {
    console.error(e)
  }
}
