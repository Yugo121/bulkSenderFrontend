<template>
<div class="modal fade" ref="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Map file</h1>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <ul class="list-group" v-for="productField in productProperties" :key="productField">
            <li class="list-group-item">
                <div class="input-group">
                    <label :for="productField" class="form-label" for="column_name">{{ productField }} in file: </label>
                </div>
                <select :id="productField" v-model="selectedMappings[productField]" class="form-select form-select-lg mb-3">
                  <option value="" disabled>Wybierz pole</option>
                  <option v-for="columnName in columnNames" :value="columnName">{{ columnName }}</option>
                </select>
            </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="mapFile" class="btn btn-light">Map file</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal-content, .list-group-item {
    background-color: rgb(43, 42, 36);;
    color: white;
}

</style>

<script>
import { Modal } from 'bootstrap';
import axios from 'axios';

export default {
    props: {
        columnNames: Array,
        productProperties: Array,
        rawCsvData: Array
    },
    data() {
        return {
            selectedMappings: {},
            modalInstance: null,
            modalMessage: ''
        }
    },
    mounted() {
        this.modalInstance = new Modal(this.$refs.modal);
    },
    methods: {
        openModal() {
            this.modalInstance.show();
        },
        mapFile() {
            console.log("Mapping file...");
            const mappingObject = {...this.selectedMappings};
            console.log(mappingObject);
            this.sendFile();
        },
        sendFile(){
          if(!this.selectedMappings || Object.keys(this.selectedMappings).length === 0) {
            console.error('Please map the file before sending.');
            return;
          };

          if(!this.rawCsvData || this.rawCsvData.length === 0) {
            console.error('No data to send.');
            return;
          };

          const payload = {
            mappings: this.selectedMappings,
            products: this.rawCsvData
          }

          console.log("Sending data to backend...");

          axios.post('https://localhost:7144/api/products/csv', payload)
            .then(response => {
              console.log("Data successfully sent!", response);
            })
            .catch(error => {
              console.error("Error occured during sending data: ", error);
            });
        }
    }
}
</script>