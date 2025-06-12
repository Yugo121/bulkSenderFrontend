import { defineStore } from 'pinia';
import { useReferenceDataStore } from './referenceDataStore';

export const useProductStore = defineStore('product', {
    state: () => ({
        productsNotInBl: [],
        productsNotInBlCount: 0,
        showNotSent: false,
    }),
    actions: {
        saveEditedProduct(product) {
            const referenceDataStore = useReferenceDataStore();
            const index = this.productsNotInBl.findIndex(p => p.id === product.id);
            if (index !== -1) {
                this.productsNotInBl[index] = product;
                referenceDataStore.saveEditedProduct(product);
            } else {
                this.productsNotInBl.push(product);
            }
        }
    }
});