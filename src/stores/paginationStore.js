import { defineStore } from 'pinia';
import { useReferenceDataStore } from './referenceDataStore';

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1,
    itemsPerPage: 10
  }),
  getters: {
    totalPages(state) {
      const referenceDataStore = useReferenceDataStore();
      return 1 + Math.ceil(referenceDataStore.parameters.length / state.itemsPerPage);
    },
    isFirstPage(state) {
      return state.currentPage === 1;
    }
  },
  actions: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  }
});