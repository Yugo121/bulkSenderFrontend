<template>
    <h1 class="text-center">Send products in bulk</h1>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-10">
          <p>Here you can send products to Baselinker.</p>
          <div class="mb-3">
            <label for="file" class="form-label">Choose file to send: </label>
            <input type="file" @change="onFileChange" class="form-control" id="file" placeholder="File" accept=".csv">
          </div>
          <button @click="proccessFile" class="btn btn-light">Send file</button>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <MapFileItem ref="mapFileItem" :columnNames="csvColumnFields" :productProperties="avaibleFields" :rawCsvData="rawCsvData" />
    <ModalAlert ref="modalAlert" :message="modalMessage"/>
</template>

<script>
import MapFileItem from '@/components/MapFileItem.vue';
import ModalAlert from '@/components/ModalAlert.vue';
import Papa from 'papaparse';

export default {
  components: {
    MapFileItem,
    ModalAlert
  },
  data () {
    return {
      file: null,
      showModal: false,
      modalMessage: '',
      avaibleFields: ['name', 'sku', 'ean', 'price', 'quantity', 'description', 'category', 'brand', "baselinker id", 'parameters' ], // rozwinąć parameters
      csvColumnFields: [],
      rawCsvData: []
    }
  },
  methods: {
    onFileChange (e) {
      this.file = e.target.files[0];
    },
    proccessFile () {
      console.log("Sending file...");

      if(!this.file) {
        this.modalMessage = 'Please select a file to upload.';
        this.$refs.modalAlert.openModal();
        return;
      }
      const fileExtension = this.file.name.split('.').pop().toLowerCase();

      if(fileExtension != 'csv') {
        this.modalMessage = 'Invalid file type. Please upload a CSV file.';
        this.$refs.modalAlert.openModal();
        return;
      }

      Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {

          if (!results.data.length) {
            this.modalMessage = 'The uploaded CSV file is empty or incorrectly formatted.';
              this.$refs.modalAlert.openModal();
             return;
          }

          this.csvColumnFields = Object.keys(results.data[0] || {});
          this.rawCsvData = results.data;

          this.$refs.mapFileItem.openModal();
        }
      });
    },
  }
}
</script>
