<template>
    <h1> Category template</h1>
    <div class="container">
        <div class="row mb-3">
            <div class="col-6">
            </div>
            <div class="col-6 d-flex justify-content-end">
                <button class="btn btn-light">Get categories from baselinker</button>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-6">
                <span>Category name</span>
            </div>
            <div class="col-6">
                <span>Baselinker category id</span>
            </div>
        </div>
        <div v-for="category in categories" :key="category.id" class="row mb-1">
            <div class="col-6">
                    <p class="form-control form-control-sm bg-dark text-white text-center">
                        {{ category.name }}
                    </p>
            </div>
            <div class="col-6">
                    <p class="form-control form-control-sm bg-dark text-white text-center">
                        {{ category.baselinkerId }}
                    </p>
            </div>
        </div>
    </div>

</template>

<script setup>
let categories = [{id: 1, name: 'Category 1', baselinkerId: '123'},];
</script>