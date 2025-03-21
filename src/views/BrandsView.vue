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
            <div class="col-4">
                <span>Brand name</span>
            </div>
            <div class="col-4">
                <span>Description</span>
            </div>
            <div class="col-4">
                <span>Mapping</span>
            </div>
        </div>
        <div v-for="brand in brands" :key="brand.id" class="row mb-1">
            <div class="col-4">
                    <p class="form-control form-control-sm bg-dark text-white">
                        {{ brand.name }}
                    </p>
            </div>
            <div class="col-4">
                    <p class="form-control form-control-sm bg-dark text-white">
                        {{ brand.description }}
                    </p>
            </div>
            <div class="col-4">
                    <p class="form-control form-control-sm bg-dark text-white d-flex justify-content-between align-items-center">
                        <span>placeholder</span>
                        <button class="btn btn-light btn-sm">Edit</button>
                    </p>    
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import  apiClient  from '@/axiosInstance';

const brands = ref([]);
const error = ref(null);

const fetchBrands = async () => {
    try {
        const response = await apiClient.get('/brands');
        brands.value = response.data;
    } catch (err) {
        error.value = err.response.data.message;
        console.error(err);
    }
};

onMounted(fetchBrands);
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