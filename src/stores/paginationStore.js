import { defineStore } from 'pinia';

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    extraPages: 0,
    pageBlockSize: 3
  }),
  getters: {
    totalPages(state) {
      return state.extraPages + Math.ceil(state.totalItems / state.itemsPerPage)
    },
    isFirstPage(state) {
      return state.currentPage === 1
    },
    isLastPage(state) {
      return state.currentPage >= this.totalPages
    },
    paginatedList: (state) => (list) => {
      const start = (state.currentPage - 1) * state.itemsPerPage
      return list.slice(start, start + state.itemsPerPage)
    },
    visiblePages(state) {
      const block = state.pageBlockSize
      const start = Math.floor((state.currentPage - 1) / block) * block + 1
      return Array.from({ length: block }, (_, i) => start + i)
        .filter(page => page >= 1 && page <= this.totalPages)
    }
  },
  actions: {
    setTotalItems(count) {
      this.totalItems = count
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
    },
    setItemsPerPage(count) {
      this.itemsPerPage = count
      this.currentPage = 1
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    }
  }
});