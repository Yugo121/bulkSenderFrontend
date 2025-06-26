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
                <label for="product-description" class="form-label">Product description</label>
                <input type="textarea" class="form-control" id="product-description" placeholder="Enter description" v-model="editedProduct.description" />
            </div>
            <div class="mb-3">
                <label for="product-price" class="form-label">Product price</label>
                <input type="number" class="form-control" id="product-price" placeholder="Enter price" v-model="editedProduct.price" />
            </div>
            <div class="mb-3">
                <label for="product-blFlag" class="form-label">Is in baselinker?</label>
                <input type="checkbox" class="form-control" id="product-blFlag" placeholder="Is in Baselinker?" v-model="editedProduct.isAddedToBaselinker" />
            </div>
            <div class="mb-3">
                <label for="product-categoryId" class="form-label">Category id</label>
                <input type="select" class="form-control" id="product-categoryId" placeholder="Category id" />
            </div>
            <div class="mb-3">
                <label for="product-brandId" class="form-label">Brand id</label>
                <input type="select" class="form-control" id="product-brandId" placeholder="Brand id" />
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
import { ref, onMounted } from 'vue';

const productStore = useProductStore();
const productModal = ref(null);

const editedProduct = ref({});

//zmienic jednak z automatycznej iteracji w body.
//name
//ean
//sku
//description
//price
//isAddedToBaselinker
//CatId => wybrać kategorię z listy i przypisać
// brandId => wybrać markę z listy i przypisać

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