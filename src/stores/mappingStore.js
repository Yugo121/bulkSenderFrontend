import { defineStore } from 'pinia';
import { useReferenceDataStore } from './referenceDataStore';
import { usePaginationStore } from './paginationStore';
import { useModalStore } from './modalStore';
import { useCsvStore } from './csvStore';
import axios from 'axios';
import { toRaw } from 'vue';

export const useMappingStore = defineStore('mapping', {
  state: () => ({
    selectedProductMappings: {},
    selectedParameterMappings: {},
    savedMappings: [],
    avaibleFields: ['name', 'sku', 'ean', 'price', 'quantity', 'description', 'category', 'brand'],
    saveMapping: true,
    mappingPayloads: [],
    mappingPayload: {},
    mappedCategories: [],
    products: [],
    productsPayload: {},
  }),
  getters: {
    currentFields: (state) => {
      const paginationStore = usePaginationStore();
      const referenceDataStore = useReferenceDataStore();

      if (paginationStore.currentPage === 1) {
        return state.avaibleFields;
      }

      const start = (paginationStore.currentPage - 2) * paginationStore.itemsPerPage;
      return referenceDataStore.parameters
        .slice(start, paginationStore.itemsPerPage)
        .map(p => p.name);
    },
    isFirstPage() {
      return usePaginationStore().isFirstPage;
    }

  },
  actions: {
    //product mappings

    updateMapping(field, value) {
      const target = this.isFirstPage ? 'selectedProductMappings' : 'selectedParameterMappings';
      this[target][field] = value;
    },
    mapFile() {
      const modalStore = useModalStore();
      const combined = {
        ...this.selectedProductMappings,
        ...this.selectedParameterMappings,
        category: { name: this.selectedProductMappings.category },
      };
      console.log("Combined mappings: ", combined);
      modalStore.mapFileItemRef.closeModal();
      this.createProductPayload(combined);
    },
    async createProductPayload(combinedMappings) {
      const csvStore = useCsvStore();
      const modalStore = useModalStore();
      if (!combinedMappings || Object.keys(combinedMappings).length === 0) {
        console.error('Please map before sending.');
        return;
      }
      const raw = csvStore.rawCsvData;
      this.products = raw.map(row => {
        const mapped = {};
        for (const [target, column] of Object.entries(combinedMappings)) {
          if (target === 'category') {
            mapped[target] = { id: 0, aliases: [row[column.name]], baselinkerId: 0, baselinkerName: "" };
          } else if (target === 'brand') {
            mapped[target] = this.selectedProductMappings.brand;
          } else {
            mapped[target] = row[column];
          }
        }
        return mapped;
      });
      this.productsPayload = { productMappings: this.selectedProductMappings, parameterMappings: this.selectedParameterMappings, products: this.products };
      modalStore.categoryModalRef.show();
    },
    async sendFile(payload) {
      const modalStore = useModalStore();
      const referenceDataStore = useReferenceDataStore();
      try {
        let flatProducts = this.products.map(p => this.flattenProduct(p));

        const allKeys = Array.from(
          new Set(flatProducts.flatMap(prod => Object.keys(prod)))
        );

        flatProducts = flatProducts.map(prod => {
          allKeys.forEach(key => {
            if (prod[key] == null) {
              prod[key] = "";
            }
          });
          return prod;
        });

        payload.products = flatProducts;
        await axios.post('https://localhost:7144/api/products/csv', payload);
        modalStore.categoryModalRef.closeModal();
        if (this.saveMapping)
          this.createMappingPayload();
        else           
          referenceDataStore.getProductsNotInBaselinker(1, 20);
      } catch (e) {
        console.error(e);
      }
    },

    //mapping actions
    async getSavedMappingsNames() {
      this.savedMappings = (await axios.get('https://localhost:7144/api/mappings/names')).data;
      return this.savedMappings;
    },
    getChoosedMapping(mappingName) { 
      axios.get(`https://localhost:7144/api/mappings/${mappingName}`)
        .then(response => {
          console.log("Mapping response: ", response);
          this.selectedProductMappings = response.data.mappingEntriesDTO
            .filter(entry => entry.mappingType === 'Product')
            .reduce((acc, entry) => {
              acc[entry.targetField] = entry.columnName;
              return acc;
            }, {});
          this.selectedParameterMappings = response.data.mappingEntriesDTO
            .filter(entry => entry.mappingType === 'Parameter')
            .reduce((acc, entry) => {
              acc[entry.targetField] = entry.columnName;
              return acc;
            }, {});
            console.log("Selected product mappings: ", this.selectedProductMappings);
        })
        .catch(error => {
          console.error('Error fetching chosen mapping:', error);
        });
    },
    createMappingPayload() {
      const modalStore = useModalStore();
      const referenceDataStore = useReferenceDataStore();
    let uniqueCategories = [];

    let seenNames = new Set();

    for (let product of this.products) {
      if (product.category && !seenNames.has(product.category.baselinkerName)) {
        seenNames.add(product.category.baselinkerName);
        uniqueCategories.push(product.category);
      }
    }

    for(let category of uniqueCategories) {
      this.mappingPayload = {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        title: '',
        category: toRaw(category),
        brand: { 
          id:crypto.randomUUID(), 
          name: this.selectedProductMappings.brand,
          baselinkerId:0, 
          description: "" },
        mappingEntriesDTO: [
          ...Object.entries(this.selectedProductMappings).map(([k,v]) => ({ id: crypto.randomUUID(), targetField:k, columnName:v, mappingType:0 })),
          ...Object.entries(this.selectedParameterMappings).map(([k,v]) => ({ id: crypto.randomUUID(), targetField:k, columnName:v, mappingType:1 }))
        ]
      };

      this.mappingPayload.category.id = crypto.randomUUID();
      this.mappingPayload.category.aliases = this.mappingPayload.category.aliases.map(name => ({
        id: crypto.randomUUID(),
        name: name,
        categoryId: this.mappingPayload.category.id
      }));
      this.mappingPayloads.push(this.mappingPayload);
    }
      modalStore.mappingMetaModalRef.show();
      referenceDataStore.getProductsNotInBaselinker(1, 20);
    },
    async sendSavedMappings() {
      const modalStore = useModalStore();

      for(let payload of this.mappingPayloads) {
        await axios.post('https://localhost:7144/api/mappings', payload)
        .then(response => {
            console.log("Mapping saved successfully!", response);
        })
        .catch(error => {
          console.error("Error occurred during saving mapping: ", error);
        }); 
      }

      modalStore.mappingMetaModalRef.closeModal();
    },

    //category actions
    assignCategoryIdInBl(catInFileName, value) {
      const existing = this.productsPayload.products.find(item => item.category.name === catInFileName);
          this.productsPayload.products.forEach(product => {
            if (product.category.aliases.includes(catInFileName)) {
                product.category.baselinkerId = value.category_id;
                product.category.baselinkerName = value.name;
                if(!product.category.aliases.includes(catInFileName))
                  product.category.aliases.push(catInFileName);
            }
        });
    },
    getCategoriesFromFile() {
      let categoriesNames = new Set();
      this.products.forEach(p => {
        if (p.category?.aliases) {
          p.category.aliases.forEach(alias => categoriesNames.add(alias));
        }
      });

      return Array.from(categoriesNames);  
    },

    //product actions
    flattenProduct(product) {
      const flatProduct = {};
    
      for (const [key, value] of Object.entries(product)) {
        if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            flatProduct[`${key}.${subKey}`] = String(subValue);
          }
        } else {
          flatProduct[key] = String(value);
        }
      }
    
      return flatProduct;
    },
  },
});