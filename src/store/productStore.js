import { defineStore } from 'pinia'

export const useProductStore = defineStore({
  id: 'productStore',
  state: () => ({
    filter: [],
    sorting: {},
    grid: 'list',
    anchor: 0
  }),
  actions: {
    updateFilter(payload) {
      this.filter[payload.categoryId] = payload.filter
    },
    updateSorting(payload) {
      this.sorting[payload.categoryId] = payload.sortType
    },
    updateGrid(payload) {
      this.grid = payload
    },
    updateAnchor(payload) {
      this.anchor = payload
    }
  }
})
