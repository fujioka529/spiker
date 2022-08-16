import { ApiHeader, ApiRequest, onError, onSuccess } from './api-base'
import { v4 as uuidv4 } from 'uuid'
import { useAccessToken } from '../store/access_token'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

const generateUuid = () => {
  return uuidv4()
}

const onRequest = async (requestConfig: AxiosRequestConfig) => {
  const store = useAccessToken()
  let accessToken = store.getAccessToken || ''

  if (requestConfig.headers && requestConfig.headers.common) {
    requestConfig.headers[ApiHeader.AUTHORIZATION] = `Bearer ${accessToken}`
    requestConfig.headers[ApiHeader.REQUEST_ID] = generateUuid()
  }
  /*
  requestConfig.headers.common[
    ApiHeader.AUTHORIZATION
  ] = `Bearer ${accessToken}`
  requestConfig.headers.common[ApiHeader.REQUEST_ID] = generateUuid()
  */
  return requestConfig
}

export class AuthApiRequest extends ApiRequest {
  protected axios(): AxiosInstance {
    var axios = null
    axios = super.createAxios()
    axios.interceptors.request.use(onRequest, onError)
    axios.interceptors.response.use(onSuccess, onError)
    return axios
  }
}
