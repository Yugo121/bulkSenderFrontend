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
              <li v-for="mapping in store.savedMappings" :key="mapping"><a @click="store.getChoosedMapping(mapping)" class="dropdown-item">{{ mapping }}</a></li>
            </ul>
          </div>
          <h5 class="text-light">
            {{ store.isFirstPage ? 'Podstawowe pola produktu' : 'Parametry dodatkowe' }}
          </h5>

          <!-- Wybór nazw kolumn -->
          <ul class="list-group">
            <li v-for="field in store.currentFields" :key="field" class="list-group-item">
              <div class="input-group">
                <label :for="field" class="form-label">{{ field }} in file:</label>
              </div>

              <select
                v-if="field === 'brand'"
                :id="field"
                :value="store.isFirstPage ? store.selectedProductMappings[field] : store.selectedParameterMappings[field]"
                @change="store.updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="brand in store.brands" key="brand" :value="brand">{{ brand }}</option>
              </select>
              
              <!-- <select
              v-else-if="field === 'category'"
                :id="field"
                :value="store.isFirstPage ? store.selectedProductMappings[field] : store.selectedParameterMappings[field]"
                @change="store.updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="category in store.categories" :value="category">{{ category }}</option>
              </select>
               -->
              <select
              v-else
                :id="field"
                :value="store.isFirstPage ? store.selectedProductMappings[field] : store.selectedParameterMappings[field]"
                @change="store.updateMapping(field, $event.target.value)"
                class="form-select form-select-lg mb-3"
              >
                <option value="" disabled>Wybierz pole</option>
                <option v-for="columnName in store.csvColumnFields" :value="columnName">{{ columnName }}</option>
              </select>
              
            </li>
          </ul>
          <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" id="saveMapping" v-model="store.saveMapping" />
            <label class="form-check-label" for="saveMapping">
              Save mapping
            </label>
          </div>
        </div>  

              <!-- Footer z buttonami -->

        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" @click="store.prevPage" class="btn btn-light" :disabled="store.currentPage === 1">Previous</button>
          <span class="text-light">Page {{ store.currentPage }} of {{ store.totalPages }}</span>
          <button type="button" @click="store.nextPage" class="btn btn-light" :disabled="store.currentPage === store.totalPages">Next</button>
          <button type="button" @click="store.mapFile" class="btn btn-light">Map file</button>
        </div>
      </div>
    </div>
  </div>

  <MappingMetaModal
    ref="mappingMetaModal"
    :payload="store.mappingPayload"
  />
</template>

<script setup>
import { useMappingStore } from '@/stores/mappingStore';
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import MappingMetaModal from '@/components/mapping/MappingMetaModal.vue';

const store = useMappingStore();
const mappingMetaModal = ref(null);
const modal = ref(null);

function openModal() {
  if (!store.modalInstance && modal.value) {
    store.modalInstance = new Modal(modal.value);
  }
  store.modalInstance.show();
}

onMounted(() => {
  store.setMappingMetaModalRef(mappingMetaModal.value);
  store.getSavedMappingsNames();
  store.getBrandsNames();
});

defineExpose({ openModal });
</script>

<style scoped>
.modal-content,
.list-group-item {
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>
