<template>
  <BaseModal ref="mapFileModal" :title="title">
    <template #body>
      <div class="dropdown mb-2" ref="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"  id="dropdownMenuButton">
              Saved mappings
            </button>
            <ul class="dropdown-menu">
              <li v-for="mapping in mappingStore.savedMappings" :key="mapping"><a @click="mappingStore.getChoosedMapping(mapping)" class="dropdown-item">{{ mapping }}</a></li>
            </ul>
          </div>
          <h5 class="text-light">
            {{ paginationStore.isFirstPage ? 'Podstawowe pola produktu' : 'Parametry dodatkowe' }}
          </h5>

          <ul class="list-group">
            <li v-for="field in mappingStore.currentFields" :key="field" class="list-group-item">
              <div class="input-group">
                <label :for="field" class="form-label">{{ field }} in file:</label>
              </div>

              <select
                v-if="field === 'brand'"
                :id="field"
                :value="paginationStore.isFirstPage ? mappingStore.selectedProductMappings[field] : mappingStore.selectedParameterMappings[field]"
                @change="mappingStore.updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="brand in referenceDataStore.brands" key="brand" :value="brand">{{ brand }}</option>
              </select>
              
              <select
              v-else
                :id="field"
                :value="paginationStore.isFirstPage ? mappingStore.selectedProductMappings[field] : mappingStore.selectedParameterMappings[field]"
                @change="mappingStore.updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="columnName in csvStore.csvColumnFields" :value="columnName">{{ columnName }}</option>
              </select>
            </li>
          </ul>
    </template>

    <template #footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="paginationStore.prevPage" class="btn btn-light" :disabled="paginationStore.currentPage === 1">Previous</button>
        <span class="text-light">Page {{ paginationStore.currentPage }} of {{ paginationStore.totalPages }}</span>
        <button type="button" @click="paginationStore.nextPage" class="btn btn-light" :disabled="paginationStore.currentPage === paginationStore.totalPages">Next</button>
        <button type="button" @click="mappingStore.mapFile" class="btn btn-light">Map file</button>
    </template>
  </BaseModal>

  <MapCategories
    ref="mapCategories"
    :payload="mappingStore.mappingPayload"
  />
</template>

<script setup>
import { useMappingStore } from '@/stores/mappingStore';
import { useModalStore } from '@/stores/modalStore';
import { usePaginationStore } from '@/stores/paginationStore';
import { useReferenceDataStore } from '@/stores/referenceDataStore';
import { useCsvStore } from '@/stores/csvStore';

import { ref, onMounted } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import MapCategories from './MapCategories.vue';

const mappingStore = useMappingStore();
const modalStore = useModalStore();
const paginationStore = usePaginationStore();
const referenceDataStore = useReferenceDataStore();
const csvStore = useCsvStore();

const mapCategories = ref(null);
const mapFileModal = ref(null);

const title = "Map file";

function openModal() {
  this.$refs.mapFileModal.show();
}
function closeModal() {
  this.$refs.mapFileModal.hide();
}

onMounted(() => {
  modalStore.setCategoryModalRef(mapCategories.value);
  mappingStore.getSavedMappingsNames();
  referenceDataStore.getBrandsNames();
  referenceDataStore.fetchParameters();
});

defineExpose({ openModal, closeModal });
</script>

<style scoped>
.modal-content,
.list-group-item {
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>
