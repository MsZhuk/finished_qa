export class SecretToken {

    constructor (request) {
        this.request = request
    }
  
    async getSecretToken (token) {
      let secretRequest = await this.request.post(`https://apichallenges.herokuapp.com/secret/token`, {
        headers: {
          "x-challenger": token,
          "Accept": "application/json",
          "authorization": "Basic YWRtaW46cGFzc3dvcmQ="
        }
      })
  
      let secretBody = await secretRequest.headers();
      return (secretBody['x-auth-token'])
    }
  };