<template>
    <h1 class="text-center my-3">Categories</h1>
    <div class="container">
        <div class="row mb-3">
            <div class="col-4">
            </div>
            <div class="col-4">
            </div>
            <div class="col-4 d-flex justify-content-end">
                <button class="btn btn-light">Get categories from baselinker</button>
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
                            <th scope="col">Baselinker name</th>
                            <th scope="col">Baselinker Id</th>
                            <th scope="col">File name</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-center" v-for="category in referenceDataStore.categories" :key="category.id">
                        <th scope="row">{{ referenceDataStore.categories.indexOf(category) + 1}}</th>
                        <td> {{ category.baselinkerName }} </td>
                        <td> {{ category.baselinkerId }} </td>
                        <td>{{ category.name }}</td>
                        <td>
                            <div class="d-inline-flex gap-2">
                                <button class="btn btn-secondary btn-sm" aria-label="Edit category">Edit</button>
                                <button class="btn btn-danger btn-sm" aria-label="Delete category">Delete</button> 
                            </div>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
</template>

<script setup>
import { useReferenceDataStore } from '@/stores/referenceDataStore.js'
import { useModalStore } from '@/stores/modalStore';
import { ref, onMounted } from 'vue';

const referenceDataStore = useReferenceDataStore()

onMounted(() => {
    referenceDataStore.fetchCategories()
});
</script>