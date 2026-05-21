export interface ConsultationSocketConfig {
  url: string
  onEvent: (data: unknown) => void
}

export interface ConsultationSocket {
  connect(): void
  disconnect(): void
  send(payload: unknown): void
  isOpen(): boolean
}
