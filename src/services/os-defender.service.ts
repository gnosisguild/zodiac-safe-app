import axios from "axios"
import {
  AuthenticationNotification,
  NotificationSummary,
  NotificationType,
  SaveNotificationDatadogRequest,
  SaveNotificationDiscordRequest,
  SaveNotificationEmailRequest,
  SaveNotificationSlackRequest,
  SaveNotificationTelegramBotRequest,
} from "utils/notification"
import { CLIENT_ID, OSDefender, POOL_ID } from "utils/os-defender"

export class OSDefenderService {
  private url = "https://defender-api.openzeppelin.com/sentinel/notifications"

  generateToken = async (apiKey: string, secretKey: string): Promise<string | null> => {
    const userPass = {
      Username: apiKey,
      Password: secretKey,
    }
    const osDefender = new OSDefender(POOL_ID, CLIENT_ID)
    const response = await osDefender.createAuthenticatedApi(userPass)
    if (response) {
      return response.token as string
    }
    return null
  }

  createNotification = async (
    type: NotificationType,
    body:
      | SaveNotificationEmailRequest
      | SaveNotificationSlackRequest
      | SaveNotificationDatadogRequest
      | SaveNotificationDiscordRequest
      | SaveNotificationTelegramBotRequest,
    auth: AuthenticationNotification,
  ): Promise<NotificationSummary> => {
    const response = await axios.post<NotificationSummary>(`${this.url}/${type}`, body, {
      headers: {
        "X-Api-Key": auth.apiKey,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, Content-Length, X-Requested-With, Accept, X-Api-Key",
        Authorization: `Bearer ${auth.token}`,
      },
    })
    return response.data
  }
}

export default new OSDefenderService()
