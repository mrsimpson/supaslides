import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'

export default function messageValidationError(message: MessageApiInjection, error: unknown) {
  // recursion – unsafe!
  if (Array.isArray(error)) {
    error.forEach((e) => messageValidationError(message, e))
  } else {
    if (
      typeof error === 'object' &&
      error &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      message.error(error.message)
    } else {
      console.error(error)
    }
  }
}
