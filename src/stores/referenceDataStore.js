import { defineStore } from 'pinia';
import { useModalStore } from './modalStore'; 
import axios from 'axios';

export const useReferenceDataStore = defineStore('referenceData', {
  state: () => ({
    parameters: [],
    brands: [],
    categories: [],
    blCategories: []
  }),
  actions: {
    async fetchParameters() {
      const modalStore = useModalStore(); 

      try {
        const res = await axios.get('https://localhost:7144/api/parameters');
        this.parameters = res.data;
      } catch (e) {
        modalStore.modalMessage = 'Error fetching parameters.';
        modalStore.modalAlertRef.openModal();
      }
    },
    async getBrandsNames() {
      try {
        this.brands = (await axios.get('https://localhost:7144/api/brands/names')).data;
      } catch (e) {
        console.error(e);
      }
    },
    async getCategoriesNames() {
      try {
        this.categories = (await axios.get('https://localhost:7144/api/categories/names')).data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchBaselinkerCategories() {
      this.blCategories = [{id: 1, name: 'buty'}, {id: 2, name: 'spodnie'}, {id: 3, name: 'koszulka'}];
      return this.blCategories;
    }
  }
});