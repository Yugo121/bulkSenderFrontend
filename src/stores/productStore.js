import { defineStore } from 'pinia';
import { useReferenceDataStore } from './referenceDataStore';

export const useProductStore = defineStore('product', {
    state: () => ({
        productsNotInBl: [],
        productsNotInBlCount: 0,
        showNotSent: false,
    }),
    getters: {
        getNotSentProductCount() {
            const referenceDataStore = useReferenceDataStore();
           this.productsNotInBlCount = referenceDataStore.getProductsNotInBaselinkerCount();
           return this.productsNotInBlCount;
        }
    }
});