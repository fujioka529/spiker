import { ApiRequest } from './api-base'

class ApiClient extends ApiRequest {
  public async login(loginId: string, password: string): Promise<string> {
    let res = await this.axios().post(`/1/login`, {
      loginId: loginId,
      password: password,
    })
    return res.data.accessToken
  }
}

export const apiClient = new ApiClient()
