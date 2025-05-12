<template>
    <BaseModal ref="BrandModal" title="Edit Brand">
        <template #body>
            <div class="mb-3">
                <label for="brandName" class="form-label">Brand Name</label>
                <input type="text" class="form-control" id="brandName" placeholder="Enter brand name" v-model="editedBrand.name" />
            </div>
            <div class="mb-3">
                <label for="brandDescription" class="form-label">Brand Description</label>
                <textarea class="form-control" id="brandDescription" rows="3" placeholder="Enter brand description" v-model="editedBrand.description"></textarea>
            </div>
            <div class="mb-3">
                <label for="brandBlId" class="form-label">Brand in Baselinker</label>
                <select class="form-select" v-model="editedBrand.baselinkerId">
                    <option :value="editedBrand.baselinkerId" disabled>Choose brand</option>
                    <option v-for="brand in referenceDataStore.blBrands" :value="brand.manufacturer_id" :key="brand.manufacturer_id">{{ brand.name }}</option>
                </select>
            </div>
        </template>
        <template #footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-secondary" @click="saveChanges(editedBrand)">Save changes</button>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '../base/BaseModal.vue';
import { ref, onMounted } from 'vue';
import { useReferenceDataStore } from '@/stores/referenceDataStore.js';

const referenceDataStore = useReferenceDataStore();

const BrandModal = ref(null);
const editedBrand = ref({
    id: null,
    name: "",
    description: "",
    baselinkerId: null
});

onMounted(() => {
  referenceDataStore.fetchBlBrands();
});

function openModal(brand) {
    editedBrand.value = brand;
  this.$refs.BrandModal.show();
}
function closeModal() {
    BrandModal.value?.hide();
}
function saveChanges(brand) {
  referenceDataStore.saveEditedBrand(brand);
  closeModal();
}
defineExpose({
  openModal, closeModal
});
</script>
