import qs from 'qs'
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'

export enum ApiHeader {
  REQUEST_ID = 'x-request-id',
  AUTHORIZATION = 'Authorization',
}

type ServerApiData = { code: string; detail: any; message: string }

export class ServerApiError extends Error {
  private status: number
  private data: ServerApiData

  constructor(status: number, message: string, data: ServerApiData) {
    super(message)
    this.name = 'ServerApiError'
    this.status = status
    this.data = data
  }
}

const onRequest = async (requestConfig: AxiosRequestConfig) => {
  return requestConfig
}

export const onSuccess = (response: AxiosResponse) => {
  return response
}

const parseApiError = (error: AxiosError) => {
  if (error.response?.data) {
    const errorData: ServerApiData = error.response.data as ServerApiData
    return Promise.reject(
      new ServerApiError(error.response.status, errorData.message, errorData)
    )
  } else {
    return Promise.reject(error)
  }
}

export const onError = (error: AxiosError) => {
  return parseApiError(error)
}

export class ApiRequest {
  protected createAxios(): AxiosInstance {
    let serverUrl
    let port = import.meta.env.VITE_API_PORT as String
    if (port.length > 0) {
      serverUrl = `http://${location.hostname}:${import.meta.env.VITE_API_PORT}`
    } else {
      serverUrl = `${import.meta.env.VITE_API_BASE}`
    }

    Axios.create({})

    const axios = Axios.create({
      baseURL: serverUrl,
      timeout: 1000 * 60 * 1,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      paramsSerializer: (params: any) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
    })
    return axios
  }

  protected axios(): AxiosInstance {
    const axios = this.createAxios()

    axios.interceptors.request.use(onRequest, onError)
    axios.interceptors.response.use(onSuccess, onError)

    return axios
  }

  protected async _list<T>(url: string): Promise<T> {
    try {
      let res = await this.axios().get(url)
      return res.data
    } catch (e: any) {
      console.error(e.message)
      throw e
    }
  }

  protected async _get<T>(
    url: string,
    params: any | undefined = undefined
  ): Promise<T> {
    try {
      let res = await this.axios().get(url, params)
      return res.data
    } catch (e: any) {
      console.error(e.message)
      throw e
    }
  }

  protected async _post<T, K>(url: string, data: T): Promise<K> {
    try {
      let res = await this.axios().post(url, data)
      return res.data
    } catch (e: any) {
      console.error(e.message)
      throw e
    }
  }

  protected async _put<T, K>(url: string, data: T): Promise<K> {
    try {
      let res = await this.axios().put(url, data)
      return res.data
    } catch (e: any) {
      console.error(e.message)
      throw e
    }
  }

  protected async _delete(url: string): Promise<void> {
    try {
      await this.axios().delete(url)
    } catch (e: any) {
      console.error(e.message)
      throw e
    }
  }
}
