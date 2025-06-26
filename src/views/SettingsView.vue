<template>
    <h1 class="text-center mt-3 mb-3">Settings</h1>
    <div class="container">
        <div class="row">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="baselinkerToken" :placeholder="token" :value="token" />
                    <label for="baselinkerToken">Baselinker token</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="catalogueId" :placeholder="catalogueId" :value="catalogueId" />
                    <label for="catalogueId">Katalog id</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="warehouseId" :placeholder="warehouseId" :value="warehouseId" />
                    <label for="warehouseId">Magazyn id</label>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-secondary">Save settings</button>
                </div>
            </div>
            <div class="col-2"></div>
        </div>
            <div class="row">
                <div class="col-2"></div>
                <div class="col-8">
                    <label for="file" class="form-label">Choose products from baselinker to send: </label>
                    <input type="file" @change="productStore.handleFileUpload"  class="form-control" id="file" placeholder="File" accept=".csv" />
                </div>
                <div class="col-2"></div>
            </div>
    </div>
</template>

<script setup>
import { useProductStore } from '@/stores/productStore.js'

const productStore = useProductStore()
//@change="productStore.send"
const token = "123Test"
const catalogueId = "123Test"
const warehouseId = "123Test"
</script>