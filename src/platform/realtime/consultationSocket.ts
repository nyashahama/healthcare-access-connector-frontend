import type { ConsultationSocketConfig, ConsultationSocket } from './types'

export const createConsultationSocket = ({
  url,
  onEvent,
}: ConsultationSocketConfig): ConsultationSocket => {
  let socket: WebSocket | null = null
  let heartbeat: ReturnType<typeof setInterval> | null = null
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let attempts = 0
  let shouldReconnect = true

  const connect = () => {
    shouldReconnect = true
    socket = new WebSocket(url)

    socket.onopen = () => {
      attempts = 0
      heartbeat = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, 25000)
    }

    socket.onmessage = (event) => onEvent(JSON.parse(event.data as string))
    socket.onclose = () => {
      if (heartbeat) clearInterval(heartbeat)
      if (!shouldReconnect) return
      const delay = Math.min(1000 * 2 ** attempts, 10000)
      attempts += 1
      retryTimer = setTimeout(connect, delay)
    }
  }

  const disconnect = () => {
    shouldReconnect = false
    if (heartbeat) clearInterval(heartbeat)
    if (retryTimer) clearTimeout(retryTimer)
    socket?.close()
  }

  const send = (payload: unknown) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload))
    }
  }

  const isOpen = () => socket?.readyState === WebSocket.OPEN

  return { connect, disconnect, send, isOpen }
}
