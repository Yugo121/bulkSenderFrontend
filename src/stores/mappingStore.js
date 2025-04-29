import { defineStore } from 'pinia';
import { useReferenceDataStore } from './referenceDataStore';
import { usePaginationStore } from './paginationStore';
import { useModalStore } from './modalStore';
import { useCsvStore } from './csvStore';
import axios from 'axios';

export const useMappingStore = defineStore('mapping', {
  state: () => ({
    selectedProductMappings: {},
    selectedParameterMappings: {},
    savedMappings: [],
    avaibleFields: ['name', 'sku', 'ean', 'price', 'quantity', 'description', 'category', 'brand'],
    saveMapping: true,
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
    updateMapping(field, value) {
      const target = this.isFirstPage ? 'selectedProductMappings' : 'selectedParameterMappings';
      this[target][field] = value;
    },
    mapFile() {
      const modalStore = useModalStore();
      const combined = {
        ...this.selectedProductMappings,
        ...this.selectedParameterMappings,
        category: { name: this.selectedProductMappings.category }
      };
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
            mapped[target] = { id: 0, name: row[column.name], baselinkerId: 0, baselinkerName: "" };
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
      try {
        const flatProducts = this.products.map(p => this.flattenProduct(p));
        payload.products = flatProducts;
        console.log("Payload: ", payload);
        await axios.post('https://localhost:7144/api/products/csv', payload);
        modalStore.categoryModalRef.closeModal();
        if (this.saveMapping) this.createMappingPayload();
      } catch (e) {
        console.error(e);
      }
    },
    async getSavedMappingsNames() {
      this.savedMappings = (await axios.get('https://localhost:7144/api/mappings/names')).data;
      return this.savedMappings;
    },
    getChoosedMapping(mappingName) { 
      axios.get(`https://localhost:7144/api/mappings/${mappingName}`)
        .then(response => {
          console.log("Mapping data: ", response.data);
          this.selectedProductMappings = response.data.mappingEntriesDTO
            .filter(entry => entry.mappingType === 0)
            .reduce((acc, entry) => {
              acc[entry.targetField] = entry.columnName;
              return acc;
            }, {});
          this.selectedParameterMappings = response.data.mappingEntriesDTO
            .filter(entry => entry.mappingType === 1)
            .reduce((acc, entry) => {
              acc[entry.targetField] = entry.columnName;
              return acc;
            }, {});
        })
        .catch(error => {
          console.error('Error fetching chosen mapping:', error);
        });
    },
    createMappingPayload() {
      const modalStore = useModalStore();
      const csvStore = useCsvStore();
      this.mappingPayload = {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        title: '',
        category: { id:0, name: csvStore.rawCsvData[0][this.selectedProductMappings.category], baselinkerId:0 , baselinkerName: "" },
        brand: { id:0, name: this.selectedProductMappings.brand, baselinkerId:0 },
        mappingEntriesDTO: [
          ...Object.entries(this.selectedProductMappings).map(([k,v]) => ({ id: crypto.randomUUID(), targetField:k, columnName:v, mappingType:0 })),
          ...Object.entries(this.selectedParameterMappings).map(([k,v]) => ({ id: crypto.randomUUID(), targetField:k, columnName:v, mappingType:1 }))
        ]
      };
      modalStore.mappingMetaModalRef.show();
    },
    sendSavedMapping() {
      const modalStore = useModalStore();

      axios.post('https://localhost:7144/api/mappings', this.mappingPayload)
      .then(response => {
          console.log("Mapping saved successfully!", response);
      })
      .catch(error => {
        console.error("Error occurred during saving mapping: ", error);
      });
    modalStore.mappingMetaModalRef.closeModal();
    },
    assignCategoryIdInBl(catInFileName, value) {
      const existing = this.productsPayload.products.find(item => item.category.name === catInFileName);
          this.productsPayload.products.forEach(product => {
            if (product.category.name === catInFileName) {
              console.log("vALUE PARAMETER : ", value);
                product.category.baselinkerId = value.id;
                product.category.baselinkerName = value.name;
            }
        });
    },
    getCategoriesFromFile() {
      let categoriesNames = this.products.map(p => p.category?.name || 'Undefined category!');
      const unique = Array.from(new Set(categoriesNames));

      return unique;
    },
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