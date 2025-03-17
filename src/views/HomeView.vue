<template>
    <h1 class="text-center">Send products in bulk</h1>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-10">
          <p>Here you can send products to Baselinker.</p>
          <div class="mb-3">
            <label for="file" class="form-label">Choose file to send: </label>
            <input type="file" @change="onFileChange" class="form-control" id="file" placeholder="File">
          </div>
          <button @click="sendFile" class="btn btn-light">Send file</button>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <MapFileItem ref="mapFileItem" :columnNames="['name', 'price', 'quantity']" :productProperties="['name', 'price', 'quantity']" />
    <ModalAlert ref="modalAlert" :message="modalMessage"/>
</template>

<script>
import MapFileItem from '@/components/MapFileItem.vue';
import ModalAlert from '@/components/ModalAlert.vue';
export default {
  components: {
    MapFileItem,
    ModalAlert
  },
  data () {
    return {
      file: null,
      showModal: false,
      modalMessage: ''
    }
  },
  methods: {
    onFileChange (e) {
      this.file = e.target.files[0];
    },
    sendFile () {
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
      
      this.$refs.mapFileItem.openModal();
      console.log("File sent.", this.file.name);
    }
  }
}
</script>
