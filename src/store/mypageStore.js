import { defineStore } from 'pinia'

export const useMypageStore = defineStore({
  id: 'mypageStore',
  state: () => ({
    isCheckPassword: false
  }),
  actions: {
    updateIsCheckPassword(payload) {
      this.isCheckPassword = payload
    }
  }
})
