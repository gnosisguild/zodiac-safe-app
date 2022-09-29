import { NotificationType } from "defender-sentinel-client"
export type { NotificationType }

export interface Body {
  apiKey: string
  apiSecret: string
  channel: NotificationType
  config: any
}
