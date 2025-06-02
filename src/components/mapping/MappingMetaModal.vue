<template>
  <BaseModal ref="mappingMetaModal">
    <template #header>
      <h5 class="modal-title">Add mapping Data</h5>
    </template>
    <template #body>
      <div v-for="(payload, index) in mappingStore.mappingPayloads" :key="index" class="mb-4 border-bottom pb-3">
        <h5>Mapping for category {{ payload.category.baselinkerName }}</h5>
        <div class="form-floating mb-3">
            <input type="text" v-model="payload.name" class="form-control" id="mappingName" placeholder="Mapping name">
            <label for="mappingName">Mapping name</label>
        </div>
        <p>Format: [product category] [product brand] [title]</p>
        <div class="form-floating mb-3">
          <input type="text" v-model="payload.title" class="form-control" id="mappingProdTitle" placeholder="Mapping product title">
          <label for="mappingProdTitle">Title for products of this mapping. </label>
        </div>
        <p>Format: [product title] [description] [product parameters]</p>
        <div class="form-floating mb-3">
          <textarea class="form-control" v-model="payload.description" placeholder="Leave a comment here" id="mappingProdDesc" style="height: 100px"></textarea>
          <label for="mappingProdDesc">Description for products of this mapping.</label>
        </div>
      </div>
    </template>
    <template #footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="mappingStore.sendSavedMappings" class="btn btn-light">Save mapping</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import { useMappingStore } from '@/stores/mappingStore';
import BaseModal from '../base/BaseModal.vue';

const mappingStore = useMappingStore();
const mappingMetaModal = ref(null);

function show() {
  this.$refs.mappingMetaModal.show();
}
function closeModal() {
  this.$refs.mappingMetaModal.hide();
}

defineExpose({
  show, closeModal
});
</script>

<style scoped>
.modal-content,
.list-group-item {
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>