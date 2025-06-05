import { defineStore } from 'pinia';
import { usePaginationStore } from './paginationStore';

export const useProductStore = defineStore('product', {
    state: () => ({
        productsNotInBl: [],
        productsNotInBlCount: 0,
        showNotSent: false,
    }),
    actions: {
         fetchNotSentProductCount(count) {
           return this.productsNotInBlCount;
        }
    }
});