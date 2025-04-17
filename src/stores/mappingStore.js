import { defineStore } from 'pinia';
import Papa from 'papaparse';
import axios from 'axios';

export const useMappingStore = defineStore('mapping', {

    state: () => ({
            file: null, //csvstore
            showModal: false, //modalstore
            modalMessage: '',
            avaibleFields: ['name', 'sku', 'ean', 'price', 'quantity', 'description', 
            'category', 'brand'],
            parameters: [], //referenceDataStore
            csvColumnFields: [], //csvstore
            rawCsvData: [], //csvstore
            mapFileItemRef: null, //modalstore
            modalAlertRef: null,// modalstore
            mappingMetaModalRef: null, //modalstore
            selectedProductMappings: {},
            selectedParameterMappings: {},
            savedMappings: [],
            brands: [], //referenceDataStore
            categories: [], //referenceDataStore
            modalInstance: null, //modalstore
            currentPage: 1,
            itemsPerPage: 10,
            saveMapping: true,
            mappingPayload: null,
    }),
    getters: {
        totalPages() {
            return 1 + Math.ceil(this.parameters.length / this.itemsPerPage);
          },
          currentFields() {
            if (this.currentPage === 1) {
              return this.avaibleFields;
            } else {
              const start = (this.currentPage - 2) * this.itemsPerPage;
              return this.parameters.slice(start, start + this.itemsPerPage).map(p => p.name);
            }
          },
          isFirstPage() {
            return this.currentPage === 1;
          } ,
    },
    actions: {
        setMapFileItemRef(ref) { //modalstore
            console.log("Setting modal ref: ", ref);
            this.mapFileItemRef = ref;
        },
        setModalAlertRef(ref) { //modalstore
            this.modalAlertRef = ref;
        },
        setMappingMetaModalRef(ref) { //modalstore
            this.mappingMetaModalRef = ref;
        },
        onFileChange (e) { //csvstrore
            this.file = e.target.files[0];
            console.log("File selected: ", this.file);
          },
          proccessFile () { //csvstore
            console.log("Sending file...");
      
            if(!this.file) {
              this.modalMessage = 'Please select a file to upload.';
              this.modalAlertRef.openModal();
              return;
            }
            const fileExtension = this.file.name.split('.').pop().toLowerCase();
      
            if(fileExtension != 'csv') {
              this.modalMessage = 'Invalid file type. Please upload a CSV file.';
              this.modalAlertRef.openModal()
              return;
            }
      
            Papa.parse(this.file, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
      
                if (!results.data.length) {
                  this.modalMessage = 'The uploaded CSV file is empty or incorrectly formatted.';
                  this.modalAlertRef.openModal();
                  return;
                }
      
                this.csvColumnFields = Object.keys(results.data[0] || {});
                this.rawCsvData = results.data;
      
                this.mapFileItemRef.openModal();
                 }
            });
          },
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
          updateMapping(field, value) {
            if (this.isFirstPage) {
              this.selectedProductMappings[field] = value;
            } else {
              this.selectedParameterMappings[field] = value;
            }
          },
          mapFile() {
            console.log("Mapping file...");
            const combinedMappings = {
              ...this.selectedProductMappings,
              ...this.selectedParameterMappings
            };
      
            console.log("Selected mappings: ", combinedMappings);
            this.sendFile(combinedMappings);
          },
          sendFile(combinedMappings) {
            if (!combinedMappings || Object.keys(combinedMappings).length === 0) {
              console.error('Please map the file before sending.');
              return;
            }
      
            if (!this.rawCsvData || this.rawCsvData.length === 0) {
              console.error('No data to send.');
              return;
            }
      
            const mappedProducts = this.rawCsvData.map(row => {
              const mappedRow = {};
              for (const [targetField, csvColumn] of Object.entries(combinedMappings)) {
                mappedRow[targetField] = row[csvColumn];
              };
              mappedRow['brand'] = this.selectedProductMappings['brand'];
              return mappedRow;
            });
      
            const payload = {
              productMappings: this.selectedProductMappings,
              parameterMappings: this.selectedParameterMappings,
              products: mappedProducts
            };
      
            console.log("Sending data to backend...", payload);
            console.log("Want to save mapping value: ", this.saveMapping)
      
            if(this.saveMapping){
                this.createPayload();
              }
      
            axios.post('https://localhost:7144/api/products/csv', payload)
              .then(response => {
                console.log("Data successfully sent!", response);
              })
              .catch(error => {
                console.error("Error occurred during sending data: ", error);
              });
          },
          nextPage() {
            if (this.currentPage < this.totalPages) {
              this.currentPage++;
            }
          },
          prevPage() {
            if (this.currentPage > 1) {
              this.currentPage--;
            }
          },
          getSavedMappingsNames() { 
            axios.get('https://localhost:7144/api/mappings/names')
              .then(response => {
                this.savedMappings = response.data;
              })
              .catch(error => {
                console.error('Error fetching saved mappings:', error);
              });
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
            console.log("productMappings: ", this.selectedProductMappings);
            console.log("parameterMappings: ", this.selectedParameterMappings);
                this.mappingPayload = {
                  id: crypto.randomUUID(),
                  name: "",
                  description: "",
                  title: "",
                  category: {
                    id: 0,
                    name: this.rawCsvData[0][this.selectedProductMappings["category"]],
                    baselinkerId: 0,
                  },
                  brand: {
                    id: 0,
                    name: this.selectedProductMappings["brand"],
                    baselinkerId: 0,
                  },
                  mappingEntriesDTO: [
                    ...Object.entries(this.selectedProductMappings).map(([key, value]) => ({
                      id: crypto.randomUUID(),
                      targetField: key,
                      columnName: value,
                      mappingType: 0
                    })),
                    ...Object.entries(this.selectedParameterMappings).map(([key, value]) => ({
                      id: crypto.randomUUID(),
                      targetField: key,
                      columnName: value,
                      mappingType: 1
                    }))
                  ],
                };
      
                this.mappingMetaModalRef.show();
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
});