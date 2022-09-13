import "cross-fetch/polyfill"
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js"

//https://docs.openzeppelin.com/defender/api-auth#apis-settings
export const POOL_ID = "us-west-2_94f3puJWv" //Open Zeppelin Pool ID
export const CLIENT_ID = "40e58hbc7pktmnp9i26hh5nsav" //Open Zeppelin Client ID

export interface OpenZeppelinAuthentication {
  Username: string //Open Zeppelin API Key
  Password: string //Open Zeppelin Secret Key
}

export interface AmazonCognitoResponse {
  token?: string
  error: boolean
}

export class OSDefender {
  userPoolId: string
  clientId: string
  token: string

  constructor(userPoolId: string, clientId: string) {
    this.userPoolId = userPoolId
    this.clientId = clientId
    this.token = ""
  }

  doAuthenticate = (
    cognitoUser: AmazonCognitoIdentity.CognitoUser,
    authenticationDetails: AmazonCognitoIdentity.AuthenticationDetails,
  ) => {
    return new Promise((resolve) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (session: AmazonCognitoIdentity.CognitoUserSession) {
          const token = session.getAccessToken().getJwtToken()
          resolve({ token, error: false })
        },
        onFailure: function (err: string) {
          return { token: undefined, error: err }
        },
      })
    })
  }

  createAuthenticatedApi = async (userPass: OpenZeppelinAuthentication): Promise<AmazonCognitoResponse> => {
    const poolData = { UserPoolId: this.userPoolId, ClientId: this.clientId }
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(userPass)
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
    const userData = { Username: userPass.Username, Pool: userPool }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    const amazonCognitoResponse = await this.doAuthenticate(cognitoUser, authenticationDetails)
    return amazonCognitoResponse as AmazonCognitoResponse
  }
}
