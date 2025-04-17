import { defineStore } from 'pinia';

export const useReferenceDataStore = defineStore('referenceData', {
    state: () => ({
        brands: [],
        parameters: [],
        categories: [],
    }),
    actions: {
        async fetchParameters() { //referenceDataStore
            try {
              const response = await axios.get('https://localhost:7144/api/parameters');
              this.parameters = response.data;
              console.log("parameters: ", this.parameters);
            } catch (error) {
              console.error('Error fetching parameters:', error);
              this.modalMessage = 'Error fetching parameters.';
              this.modalAlertRef.openModal();
            }
          },
          getBrandsNames(){ //referenceDataStore
            axios.get('https://localhost:7144/api/brands/names')
              .then(response => {
                this.brands = response.data;
                console.log("Brands: ", this.brands);
              })
              .catch(error => {
                console.error('Error fetching brands:', error);
              });
          },
          getCategoriesNames(){ //referenceDataStore
            axios.get('https://localhost:7144/api/categories/names')
              .then(response => {
                this.categories = response.data;
                console.log("Categories: ", this.categories);
              })
              .catch(error => {
                console.error('Error fetching categories:', error);
              });
          },

    }
})