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
        </div>
      </div>
      <div v-if="mappingStore.products.length > 0" class="row">
        <div class="col"></div>
        <div class="col-10">
          <div class="mt-3">
            <p>Added listed below products to db. Do you want to send them to baselinker?</p>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center" style="background-color: rgb(43, 42, 36);" v-for="product in mappingStore.products" :key="product.id">
                <div class="d-flex align-items-center" >
                  <label style="color: white;" class="me-2" :for="product.ean">Ean:</label>
                  <span class="input-group-text me-2" :id="product.ean">{{ product.ean }}</span>
                  <label style="color: white;" class="me-2" :for="product.sku">Sku:</label>
                  <span class="input-group-text" :id="product.sku">{{ product.sku }}</span>
                </div>
                <button class="btn btn-light" aria-label="Edit mapping">Edit mapping</button>
              </li>
            </ul>
          </div>
        </div>
        <div class="col">
          <button @click="referenceDataStore.sendProductsToBaselinker(mappingStore.products)" class="btn btn-light">Send to baselinker!</button>
        </div>
        </div>
    </div>
    <MapFileItem ref="mapFileItem" />
    <ModalAlert ref="modalAlert" :message="modalStore.modalMessage"/>
</template>

<script setup>
import { useModalStore } from '@/stores/modalStore';
import { useMappingStore } from '@/stores/mappingStore';
import { useCsvStore } from '@/stores/csvStore';
import { useReferenceDataStore } from '@/stores/referenceDataStore';
import { ref, onMounted } from 'vue';
import ModalAlert from '@/components/ModalAlert.vue';
import MapFileItem from '@/components/mapping/MapFileItem.vue';

const modalStore = useModalStore();
const mappingStore = useMappingStore();
const referenceDataStore = useReferenceDataStore();
const csvStore = useCsvStore();
const modalAlert = ref(null);
const mapFileItem = ref(null);

onMounted(() => {
  modalStore.setModalAlertRef(modalAlert.value);
  modalStore.setMapFileItemRef(mapFileItem.value);
});
</script>