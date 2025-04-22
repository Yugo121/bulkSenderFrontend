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
      const combined = {
        ...this.selectedProductMappings,
        ...this.selectedParameterMappings,
        category: { name: this.selectedProductMappings.category }
      };
      this.sendFile(combined);
    },
    async sendFile(combinedMappings) {
      const csvStore = useCsvStore();
      if (!combinedMappings || Object.keys(combinedMappings).length === 0) {
        console.error('Please map before sending.');
        return;
      }
      const raw = csvStore.rawCsvData;
      this.products = raw.map(row => {
        const mapped = {};
        for (const [target, column] of Object.entries(combinedMappings)) {
          mapped[target] = row[column];
        }
        mapped.brand = this.selectedProductMappings.brand;
        return mapped;
      });
      const payload = { productMappings: this.selectedProductMappings, parameterMappings: this.selectedParameterMappings, products: this.products };
      if (this.saveMapping) this.createPayload();
      try {
        await axios.post('https://localhost:7144/api/products/csv', payload);
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
    createPayload() {
      const modalStore = useModalStore();
      const csvStore = useCsvStore();
      this.mappingPayload = {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        title: '',
        category: { id:0, name: csvStore.rawCsvData[0][this.selectedProductMappings.category], baselinkerId:0 },
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

      console.log("Mapping payload: ", this.mappingPayload);
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
      const existing = this.mappedCategories.find(item => item.name === catInFileName);
      if (existing) {
          existing.baselinkerId = value;
      }else {
          this.mappedCategories.push({
          name: catInFileName,
          baselinkerId: value
          });
      }
    },
    getCategoriesFromFile() {
      let categoriesNames = this.products.map(p => p.category?.name || 'Undefined category!');
      return categoriesNames;
    }
  },
});