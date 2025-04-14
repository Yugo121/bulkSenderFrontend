<template>
  <div class="modal fade" ref="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Map file</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <!-- Body z polami wyboru -->
         <!-- Wybór mapowania -->
        <div class="modal-body">
          <div class="dropdown mb-2" ref="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"  id="dropdownMenuButton">
              Saved mappings
            </button>
            <ul class="dropdown-menu">
              <li v-for="mapping in savedMappings" :key="mapping"><a @click="getChoosedMapping(mapping)" class="dropdown-item">{{ mapping }}</a></li>
            </ul>
          </div>
          <h5 class="text-light">
            {{ isFirstPage ? 'Podstawowe pola produktu' : 'Parametry dodatkowe' }}
          </h5>

          <!-- Wybór nazw kolumn -->
          <ul class="list-group">
            <li v-for="field in currentFields" :key="field" class="list-group-item">
              <div class="input-group">
                <label :for="field" class="form-label">{{ field }} in file:</label>
              </div>

              <select
                v-if="field === 'brand'"
                :id="field"
                :value="isFirstPage ? selectedProductMappings[field] : selectedParameterMappings[field]"
                @change="updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="brand in brands" key="brand" :value="brand">{{ brand }}</option>
              </select>

              <select
              v-else
                :id="field"
                :value="isFirstPage ? selectedProductMappings[field] : selectedParameterMappings[field]"
                @change="updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="columnName in columnNames" :value="columnName">{{ columnName }}</option>
              </select>
              
            </li>
          </ul>
          <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" id="saveMapping" v-model="saveMapping" />
            <label class="form-check-label" for="saveMapping">
              Save mapping
            </label>
          </div>
        </div>  

              <!-- Footer z buttonami -->

        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" @click="prevPage" class="btn btn-light" :disabled="currentPage === 1">Previous</button>
          <span class="text-light">Page {{ currentPage }} of {{ totalPages }}</span>
          <button type="button" @click="nextPage" class="btn btn-light" :disabled="currentPage === totalPages">Next</button>
          <button type="button" @click="mapFile" class="btn btn-light">Map file</button>
        </div>
      </div>
    </div>
  </div>

  <MappingMetaModal
    ref="mappingMetaModal"
    :payload="mappingPayload"
  />
</template>

<script>
import { Modal } from 'bootstrap';
import axios from 'axios';
import MappingMetaModal from '@/components/mapping/MappingMetaModal.vue';

export default {
  components: {
    MappingMetaModal
  },
  props: {
    columnNames: Array,
    productProperties: Array,
    parameters: Array,
    rawCsvData: Array,
  },
  data() {
    return {
      selectedProductMappings: {},
      selectedParameterMappings: {},
      savedMappings: [],
      brands: [],
      modalInstance: null,
      modalMessage: '',
      currentPage: 1,
      itemsPerPage: 10,
      saveMapping: true,
      mappingPayload: null
    };
  },
  computed: {
    totalPages() {
      return 1 + Math.ceil(this.parameters.length / this.itemsPerPage);
    },
    currentFields() {
      if (this.currentPage === 1) {
        return this.productProperties;
      } else {
        const start = (this.currentPage - 2) * this.itemsPerPage;
        return this.parameters.slice(start, start + this.itemsPerPage).map(p => p.name);
      }
    },
    isFirstPage() {
      return this.currentPage === 1;
    }
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.modal);
    this.getSavedMappingsNames();
    this.getBrandsNames();
  },
  methods: {
    openModal() {
      this.modalInstance.show();
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
            },
            brand: {
              id: 0,
              name: this.selectedProductMappings["brand"],
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

          this.$nextTick(() => {
            this.$refs.mappingMetaModal.show();
          });
    },
    getBrandsNames(){
      axios.get('https://localhost:7144/api/brands/names')
        .then(response => {
          this.brands = response.data;
          console.log("Brands: ", this.brands);
        })
        .catch(error => {
          console.error('Error fetching brands:', error);
        });
    }
  }
};
</script>

<style scoped>
.modal-content,
.list-group-item {
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>
