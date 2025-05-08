<template>
    <h1 class="text-center my-3">Brands</h1>
    <div class="container">
        <div class="row mb-3">
            <div class="col-4">
            </div>
            <div class="col-4">
            </div>
            <div class="col-4 d-flex justify-content-end">
                <button class="btn btn-light">Get brands from baselinker</button>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-1">
            </div>
            <div class="col-12 ">
                <table class="table table-dark table-bordered">
                    <thead>
                        <tr class="text-center">
                        <th scope="col">#</th>
                        <th scope="col">Brand name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Baselinker id</th>
                        <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-center" v-for="brand in referenceDataStore.brands" :key="brand.id">
                        <th scope="row">{{ referenceDataStore.brands.indexOf(brand) + 1}}</th>
                        <td> {{ brand.name }} </td>
                        <td> {{ brand.description }} </td>
                        <td> {{ brand.baselinkerId }} </td>
                        <td>
                            <button class="btn btn-secondary btn-sm" aria-label="Edit brand" @click="editBrand(brand)">Edit brand</button>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
    <BrandModal ref="brandModalRef"></BrandModal>
</template>

<script setup>
import { useReferenceDataStore } from '@/stores/referenceDataStore.js'
import { useModalStore } from '@/stores/modalStore';
import { ref, onMounted } from 'vue';
import BrandModal from '@/components/entities/BrandModal.vue';

const referenceDataStore = useReferenceDataStore()
const modalStore = useModalStore()
const brandModalRef = ref(null)

onMounted(() => {
    referenceDataStore.fetchBrands()
    modalStore.setBrandModalRef(brandModalRef)
})

function editBrand(brand) {
    brandModalRef.value.openModal(brand)
}
</script>

<style scoped>
p {
   height: 40px; 
   line-height: 40px;
   width: 100%;
   padding: 0 10px;
   box-sizing: border-box;
   font-size: 14px; 
}
.form-control {
    overflow: hidden;
}
</style>