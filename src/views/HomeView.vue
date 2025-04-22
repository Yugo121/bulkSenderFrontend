<template>
    <h1 class="text-center">Send products in bulk</h1>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-10">
          <p>Here you can send products to Baselinker.</p>
          <div class="mb-3">
            <label for="file" class="form-label">Choose file to send: </label>
            <input type="file" @change="csvStore.onFileChange" class="form-control" id="file" placeholder="File" accept=".csv">
          </div>
          <button @click="csvStore.processFile" class="btn btn-light">Send file</button>
        </div>
        <div class="col">
          <button @click="mapCategories.show" class="btn btn-light">Map categories</button>
        </div>
      </div>
    </div>
    <MapFileItem ref="mapFileItem" />
    <ModalAlert ref="modalAlert" :message="modalStore.modalMessage"/>
    <MapCategories ref="mapCategories" />
</template>

<script setup>
import { useModalStore } from '@/stores/modalStore';
import { useCsvStore } from '@/stores/csvStore';
import { ref, onMounted } from 'vue';
import ModalAlert from '@/components/ModalAlert.vue';
import MapFileItem from '@/components/mapping/MapFileItem.vue';
import MapCategories from '@/components/mapping/MapCategories.vue';

const modalStore = useModalStore();
const csvStore = useCsvStore();
const modalAlert = ref(null);
const mapFileItem = ref(null);
const mapCategories = ref(null);

onMounted(() => {
  modalStore.setModalAlertRef(modalAlert.value);
  modalStore.setMapFileItemRef(mapFileItem.value);
  modalStore.setCategoryModalRef(mapCategories.value);
});
</script>