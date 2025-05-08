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
                <label for="brandBlId" class="form-label">Brand Baselinker Id</label>
                <input type="number" class="form-control" id="brandBlId" placeholder="Enter brand baselinker id" v-model="editedBrand.baselinkerId"/>
            </div>
            <div class="mb-3 d-flex justify-content-center">
                <button type="button" class="btn btn-secondary mt-2">Get brands from baselinker</button>
            </div>
        </template>
        <template #footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-secondary" @click="referenceDataStore.saveEditedBrand(editedBrand)">Save changes</button>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '../base/BaseModal.vue';
import { ref } from 'vue';
import { useReferenceDataStore } from '@/stores/referenceDataStore.js';

const referenceDataStore = useReferenceDataStore();

const BrandModal = ref(null);
const editedBrand = ref({
    id: null,
    name: "",
    description: "",
    baselinkerId: null
});

function openModal(brand) {
    editedBrand.value = brand;
  this.$refs.BrandModal.show();
}
function closeModal() {
  this.$refs.BrandModal.hide();
}

defineExpose({
  openModal, closeModal
});
</script>
