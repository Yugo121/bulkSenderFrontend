<template>
  <BaseModal ref="mappingMetaModal">
    <template #header>
      <h5 class="modal-title">Add mapping Data</h5>
    </template>
    <template #body>
      <div class="form-floating mb-3">
          <input type="text" v-model="mappingStore.mappingPayload.name" class="form-control" id="mappingName" placeholder="Mapping name">
          <label for="mappingName">Mapping name</label>
      </div>
      <div class="form-floating mb-3">
        <input type="text" v-model="mappingStore.mappingPayload.title" class="form-control" id="mappingProdTitle" placeholder="Mapping product title">
        <label for="mappingProdTitle">Title</label>
      </div>
      <div class="form-floating mb-3">
        <textarea class="form-control" v-model="mappingStore.mappingPayload.description" placeholder="Leave a comment here" id="mappingProdDesc" style="height: 100px"></textarea>
        <label for="mappingProdDesc">Description</label>
      </div>
    </template>
    <template #footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="mappingStore.sendSavedMapping" class="btn btn-light">Save mapping</button>
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