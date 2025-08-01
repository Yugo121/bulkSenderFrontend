<template>
    <BaseModal ref="productModal" title="Edit Product">
        <template #body>
            <div class="mb-3">
                <label for="product-name" class="form-label">Product name</label>
                <input type="text" class="form-control" id="product-name" placeholder="Enter name" v-model="editedProduct.name" />
            </div>
            <div class="mb-3">
                <label for="product-sku" class="form-label">Product sku</label>
                <input type="text" class="form-control" id="product-sku" placeholder="Enter sku" v-model="editedProduct.sku" />
            </div>
            <div class="mb-3">
                <label for="product-ean" class="form-label">Product ean</label>
                <input type="text" class="form-control" id="product-ean" placeholder="Enter ean" v-model="editedProduct.ean" />
            </div>
            <div class="mb-3">
                <label for="product-price" class="form-label">Product price</label>
                <input type="number" class="form-control" id="product-price" placeholder="Enter price" v-model="editedProduct.price" />
            </div>
            <div class="mb-3">
                <label for="product-baselinkerId" class="form-label">Product baselinker id</label>
                <input type="number" class="form-control" id="product-baselinkerId" placeholder="Enter baselinker id" v-model="editedProduct.baselinkerId" />
            </div>
            <div class="mb-3">
                <label for="product-baselinkerParentId" class="form-label">Product baselinker parent id</label> 
                <input type="number" class="form-control" id="product-baselinkerParentId" placeholder="Enter baselinker parent id" v-model="editedProduct.baselinkerParentId" />
            </div>
            <div class="mb-3">
                <select  class="form-select form-select-lg mb-3" v-model="editedProduct.isAddedToBaselinker">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div class="mb-3">
                <select class="form-select form-select-lg mb-3" v-model="editedProduct.categoryId">
                    <option value="" disabled>Select category</option>
                    <option v-for="category in referenceDataStore.categories" :value="category.id" :key="category.id">{{ category.name }}</option>
                </select>
            </div>
            <div class="mb-3">
                <select class="form-select form-select-lg mb-3" v-model="editedProduct.brandId">
                    <option value="" disabled>Select category</option>
                    <option v-for="brand in referenceDataStore.brands" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
                </select>
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-danger" @click="closeModal()">Close</button>
            <button type="button" class="btn btn-secondary" @click="productStore.saveEditedProduct(editedProduct)">Save changes</button> 
        </template> 
    </BaseModal>
</template>

<script setup>
import BaseModal from '../base/BaseModal.vue';
import { useProductStore } from '@/stores/productStore.js';
import { useReferenceDataStore } from '@/stores/referenceDataStore.js';
import { ref, onMounted } from 'vue';

const productStore = useProductStore();
const referenceDataStore = useReferenceDataStore();
const productModal = ref(null);

const editedProduct = ref({});

function openModal(product) {
    editedProduct.value = { ...product };
    console.log('Opening product modal with product:', editedProduct.value);
    productModal.value?.show();
};
function closeModal() {
    productModal.value?.hide();
};

defineExpose({
    openModal, closeModal
});
</script>