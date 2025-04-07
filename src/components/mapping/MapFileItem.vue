<template>
  <div class="modal fade" ref="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Map file</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <h5 class="text-light">
            {{ isFirstPage ? 'Podstawowe pola produktu' : 'Parametry dodatkowe' }}
          </h5>
          <ul class="list-group">
            <li v-for="field in currentFields" :key="field" class="list-group-item">
              <div class="input-group">
                <label :for="field" class="form-label">{{ field }} in file:</label>
              </div>
              <select
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
        </div>
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
</template>

<script>
import { Modal } from 'bootstrap';
import axios from 'axios';

export default {
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
      modalInstance: null,
      modalMessage: '',
      currentPage: 1,
      itemsPerPage: 10
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
        }
        return mappedRow;
      });

      const payload = {
        productMappings: this.selectedProductMappings,
        parameterMappings: this.selectedParameterMappings,
        products: mappedProducts
      };

      console.log("Sending data to backend...", payload);

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
