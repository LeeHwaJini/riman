import { defineStore } from 'pinia'

export const useCartStore = defineStore({
  id: 'cartStore',
  state: () => ({
    cartType: 'normal',
    refreshParams: null,
    shouldUpdateNormalCart: true,
    shouldUpdateAutoCart: true,
    shouldUpdateRefreshCart: true,
    selectedNormalCart: []
  }),
  actions: {
    updateRefreshParams(payload) {
      this.refreshParams = payload
    },
    updateCartType(payload) {
      this.cartType = payload
    },
    updateShouldUpdateNormalCart(payload) {
      this.shouldUpdateNormalCart = payload
    },
    updateShouldUpdateAutoCart(payload) {
      this.shouldUpdateAutoCart = payload
    },
    updateShouldUpdateRefreshCart(payload) {
      this.shouldUpdateRefreshCart = payload
    },
    updateSelectedNormalCart(payload) {
      this.selectedNormalCart = payload
    }
  }
})
