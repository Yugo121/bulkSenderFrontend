<template>
    <h1 class="text-center">Send products in bulk</h1>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-10">
          <p>Here you can send products to Baselinker.</p>
          <div class="mb-3">
            <label for="file" class="form-label">Choose file to send: </label>
            <input type="file" @change="store.onFileChange" class="form-control" id="file" placeholder="File" accept=".csv">
          </div>
          <button @click="store.proccessFile" class="btn btn-light">Send file</button>
        </div>
        <div class="col"></div>
      </div>
    </div>
    <MapFileItem ref="mapFileItem" />
    <ModalAlert ref="modalAlert" :message="store.modalMessage"/>
</template>

<script setup>
import { useMappingStore } from '@/stores/mappingStore';
import { ref, onMounted } from 'vue';
import ModalAlert from '@/components/ModalAlert.vue';
import MapFileItem from '@/components/mapping/MapFileItem.vue';

const store = useMappingStore();
const modalAlert = ref(null);
const mapFileItem = ref(null);

onMounted(() => {
  store.setModalAlertRef(modalAlert.value);
  store.setMapFileItemRef(mapFileItem.value);
  store.fetchParameters();
});
</script>