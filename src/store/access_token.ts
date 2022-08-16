import { defineStore } from 'pinia'

export const useAccessToken = defineStore('accessToken', {
  state: () => {
    return {
      accessToken: undefined as String | undefined,
    }
  },
  getters: {
    getAccessToken: (state) => state.accessToken,
  },
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
    },
    logout() {
      this.accessToken = undefined
    },
  },
  persist: {
    enabled: true,
  },
})
