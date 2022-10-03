import { NotificationType } from "defender-sentinel-client"

export interface Body {
  apiKey: string
  apiSecret: string
  channel: NotificationType
  config: any
}
