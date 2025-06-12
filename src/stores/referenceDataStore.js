import { defineStore } from 'pinia';
import { useModalStore } from './modalStore'; 
import { useProductStore } from './productStore';
import { RequestQueue } from '@/utils/requestQueue';
import axios from 'axios';

export const useReferenceDataStore = defineStore('referenceData', {
  state: () => ({
    parameters: [],
    brands: [],
    blBrands: [],
    categories: [],
    blCategories: [],
    productsNotInBl: [],
    sentCount: 0,
    totalCount: 0,
    isUploading: false,
    queue: null
  }),
  getters: {
    uploadProgressPercent: (state) => {
      if (state.totalCount === 0) return 0;
      return Math.round((state.sentCount / state.totalCount) * 100);
    }
  },
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
    async deleteParameter(parameter) {
      try{
        console.log("Deleting parameter: ", parameter);
        const res = await axios.delete(`https://localhost:7144/api/parameter/delete/${parameter.name}`);
        this.parameters = this.parameters.filter(p => p.name !== parameter.name);
        console.log("Parameter deleted successfully: ", res.data);
      } catch (error) {
        console.error("Error deleting parameter: ", error);
      }
    },

    async addParameter(parameter) {
      try {
        console.log("Adding parameter: ", parameter);
        const res = await axios.post('https://localhost:7144/api/parameter', parameter);
        this.parameters.push(parameter);
        console.log("Parameter added successfully: ", res.data);
      } catch (error) {
        console.error("Error adding parameter: ", error);
      }
    },

    //brands actions
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
    async addBrandsFromBaselinker() {
      await this.fetchBlBrands();
      try {
        for (const brand of this.blBrands) {

          const brandDto = {
            id: crypto.randomUUID(),
            name: brand.name,
            baselinkerId: brand.manufacturer_id,
            description: "",
          };

          if(this.brands.some(b => b.name.toLowerCase() === brandDto.name.toLowerCase()) 
            || this.brands.some(b => b.baselinkerId === brandDto.baselinkerId)) {
            console.log("Brand already exists: ", brandDto.name);
            continue;
          }
          console.log("Adding brand: ", brandDto);
          const res = await axios.post('https://localhost:7144/api/brand', brandDto );
        }
      }catch (error) {
        console.error("Error fetching brands from Baselinker: ", error);
      }
    },
    async deleteBrand(brand) {
      try {
        const res = await axios.delete(`https://localhost:7144/api/brand/delete/${brand.id}`);
        this.brands = this.brands.filter(b => b.id !== brand.id);
        console.log("Brand deleted successfully: ", res.data);
      } catch (error) {
        console.error("Error deleting brand: ", error);
      }
    },
    async saveEditedBrand(brand) {
      try {
        const res = await axios.put(`https://localhost:7144/api/brand/edit/${brand.id}`,  { brand });
      }catch(error){
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

    //categories actions
    async getCategoriesNames() {
      try {
        this.categories = (await axios.get('https://localhost:7144/api/categories/names')).data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchCategories() {
      try{
        const res = await axios.get('https://localhost:7144/api/categories');
        console.log("Fetched categories: ", res.data);
        this.categories = res.data;
      }catch(error){
        console.error("Error fetching categories: ", error);
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
    async addBaselinkerCategories() {
      await this.fetchBaselinkerCategories();
      try {
        for (const category of this.blCategories) {
          console.log("Processing Baselinker category: ", category);
          const categoryDto = {
            id: crypto.randomUUID(),
            baselinkerName: category.name,
            baselinkerId: category.category_id,
          };

          if(this.categories.some(c => c.name.toLowerCase() === categoryDto.name.toLowerCase()) 
            || this.categories.some(c => c.baselinkerId === categoryDto.baselinkerId)) {
            console.log("Category already exists: ", categoryDto.name);
            continue;
          }
          console.log("Adding category: ", categoryDto);
          //const res = await axios.post('https://localhost:7144/api/category', categoryDto );
        }
      }catch (error) {
        console.error("Error fetching categories from Baselinker: ", error);
      }
    },
    async deleteCategory(category) {
      try {
        const res = await axios.delete(`https://localhost:7144/api/category/delete/${category.id}`);
        this.categories = this.categories.filter(c => c.id !== category.id);
        console.log("Category deleted successfully: ", res.data);
      } catch (error) {
        console.error("Error deleting category: ", error);
      }
    },
    async saveEditedCategory(category) {
      try {
        const res = await axios.put(`https://localhost:7144/api/category/edit/${category.id}`,  { category });
      }catch(error){
        console.error("Error saving edited category: ", error);
      }
    },

    //products actions
    async sendProductToBaselinker(product) {
      console.log("Sending product to Baselinker: ", product);
        try {
          const response = await axios.post(
            'https://localhost:7144/api/baselinker/products',
            product
          );
          console.log("Product sent successfully!", response);
        } catch (error) {
          console.error("Error occurred during sending product: ", error);
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
        console.log("Products not in Baselinker count: ", productStore.productsNotInBlCount);
      } catch (e) {
        console.error(e);
      }
    },
    async sendEditedProduct(product) {
      console.log("Sending edited product to Baselinker: ", product);
      try {
        const response = await axios.put(
          'https://localhost:7144/api/baselinker/products',
          product
        );
        console.log("Product sent successfully!", response);
      } catch (error) {
        console.error("Error occurred during sending edited product: ", error);
      }
    },

    //queue actions
    initQueue() {
      this.queue = new RequestQueue(40, (completed, total) => {
        this.sentCount = completed;
        this.totalCount = total;
      });
    },
    async startSending(products) {
      const productStore = useProductStore();

      if(this.isUploading) {
        console.warn("Upload is already in progress.");
        return;
      }
      this.isUploading = true;
      this.sentCount = 0;
      this.totalCount = products.length;

      if(!this.queue) {
        this.initQueue();
      }
      
      for(const product of products) {
        this.queue.enqueue(async () => {
          await this.sendProductToBaselinker(product);

          const productId = productStore.productsNotInBl.findIndex(p => p.id === product.id);
          if(productId !== -1) {
            productStore.productsNotInBl.splice(productId, 1);
          }
          
        });
      }

      const checkFinish = setInterval(() => {
        if(!this.queue || this.queue.completed === this.queue.totalRequests) {
          this.isUploading = false;
          clearInterval(checkFinish);
        };
      }, 500);
    },
    pauseQueue() {
      if(this.queue) {
        this.queue.pause();
      }
    },
    resumeQueue() {
      if(this.queue) {
        this.queue.resume();
      }
    },
    cancelQueue() {
      if(this.queue) {
        this.queue.cancel();
        this.isUploading = false;
        this.queue = null;
      }
    }
  }
});