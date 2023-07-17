import { apiClient } from '../../service/api-client'
import { useAccessToken } from '../../store/access_token'

const useAccount = () => {
  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      let accessToken = await apiClient.login(loginId, password)
      const store = useAccessToken()
      store.$patch({
        accessToken: accessToken,
      })
      return true
    } catch (e: any) {
      console.error(e)
      throw e
    }
    return false
  }

  return {
    login,
  }
}

export default useAccount
