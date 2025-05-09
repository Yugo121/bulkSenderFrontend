import { defineStore } from 'pinia';
import { useModalStore } from './modalStore'; 
import { useProductStore } from './productStore';
import axios from 'axios';

export const useReferenceDataStore = defineStore('referenceData', {
  state: () => ({
    parameters: [],
    brands: [],
    blBrands: [],
    categories: [],
    blCategories: [],
    productsNotInBl: [],
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
    async fetchBrands() {
      try{
        const res = await axios.get('https://localhost:7144/api/brands');
        this.brands = res.data;
      }catch(error){
        console.error("Error fetching brands: ", error);
      }
    },
    async fetchBlBrands() {
      try{
        const res = await axios.get('https://localhost:7144/api/baselinker/brands');
        this.blBrands = res.data;
      }catch(error){
        console.error("Error fetching Baselinker brands: ", error);
      }
    },
    async saveEditedBrand(brand) {
      console.log("Brand to edit: ", brand);
      try {
        const res = await axios.put(`https://localhost:7144/api/brand/edit/${brand.id}`,  { brand });
      }catch(erroer){
        console.error("Error saving edited brand: ", error);
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
      try{
        this.blCategories = (await axios.get('https://localhost:7144/api/baselinker/categories')).data;
      }catch(error){
        console.error("Error fetching Baselinker categories: ", error);
      }
      return this.blCategories;
    },
    async sendProductsToBaselinker(products) {
      console.log("Sending products to Baselinker: ", products);
      for (const product of products) {
        console.log("Sending product: ", product);
        try {
          const response = await axios.post(
            'https://localhost:7144/api/baselinker/products',
            product
          );
          console.log("Product sent successfully!", response);
        } catch (error) {
          console.error("Error occurred during sending product: ", error);
          continue;
        }
      }
      console.log("All done");
    },
    async getProductsNotInBaselinker(page, quantity) {
      try {
        const productStore = useProductStore();
        const res = await axios.get(`https://localhost:7144/api/products/search/notInBl/${page}/${quantity}`);
        console.log("Products not in Baselinker: ", res.data);
        productStore.productsNotInBl = res.data;
        productStore.showNotSent = true;
      } catch (e) {
        console.error(e);
      }
    },
    async getProductsNotInBaselinkerCount() {
      try {
        const productStore = useProductStore();
        const res = await axios.get('https://localhost:7144/api/products/search/notInBl/all');
        productStore.productsNotInBlCount = res.data;
      } catch (e) {
        console.error(e);
      }
    },
  }
});