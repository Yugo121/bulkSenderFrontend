<template>
    <h1 class="text-center my-3">Send products in bulk</h1>
    <div class="container">
      <div class="row">
        <div class="col"></div>
        <div class="col-10">
          <p>Here you can send products to Baselinker.</p>
          <div class="mb-3">
            <label for="file" class="form-label">Choose file to send: </label>
            <input type="file" @change="csvStore.onFileChange" class="form-control" id="file" placeholder="File" accept=".csv">
          </div>
          <button @click="csvStore.processFile" class="btn btn-light">Send file</button>
        </div>
        <div class="col"></div>
      </div>
      <div class="row my-4">
        <div class="col"></div>
        <div class="col-10 text-center">
          <button @click="referenceDataStore.getProductsNotInBaselinker(paginationStore.currentPage, paginationStore.itemsPerPage)" class="btn btn-light">Show products to send to baselinker</button>
        </div>
        <div class="col"></div>
      </div>
      <div v-if="productStore.productsNotInBl.length > 0 && productStore.showNotSent" class="row">
        <div class="col"></div>
        <div class="col-10">
          <div class="mt-3">
            <p>Listed below products were added to db but not to baselinker. Do you want to send them to baselinker?</p>
            <table class="table table-dark table-bordered">
              <thead>
                <tr class="text-center">
                  <th scope="col">#</th>
                  <th scope="col">Ean</th>
                  <th scope="col">Sku</th>
                  <th scope="col">Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr  v-for="product in productStore.productsNotInBl" :key="product.id" class="text-center">
                  <th scope="row">{{ productStore.productsNotInBl.indexOf(product) + 1}}</th>
                  <td>{{ product.ean }}</td>
                  <td> {{ product.sku }}</td>
                  <td> {{ product.name }}</td>
                  <td>
                    <button class="btn btn-secondary" aria-label="Edit product" :value="product.id">Edit product</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="my-3">
            <nav aria-label="Page navigation example">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: paginationStore.isFirstPage }">
                  <a @click="prevPage()" class="page-link" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li class="page-item" v-for="page in paginationStore.visiblePages"><a @click="showPage(page)" class="page-link" >{{page}}</a></li>
                <li class="page-item" :class="{ disabled: paginationStore.isLastPage }">
                  <a @click="nextPage()" class="page-link" aria-label="Next">
                    <span   aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>          
          </div>
        </div>
        <div class="col">
          <button @click="referenceDataStore.sendProductsToBaselinker(productStore.productsNotInBl)" class="btn btn-light">Send to baselinker!</button>
        </div>
      </div>
    </div>
    <MapFileItem ref="mapFileItem" />
    <ModalAlert ref="modalAlert" :message="modalStore.modalMessage"/>
</template>

<script setup>
import { useModalStore } from '@/stores/modalStore';
import { usePaginationStore } from '@/stores/paginationStore';
import { useMappingStore } from '@/stores/mappingStore';
import { useCsvStore } from '@/stores/csvStore';
import { useReferenceDataStore } from '@/stores/referenceDataStore';
import { useProductStore } from '@/stores/productStore';
import { ref, onMounted } from 'vue';
import ModalAlert from '@/components/ModalAlert.vue';
import MapFileItem from '@/components/mapping/MapFileItem.vue';

const modalStore = useModalStore();
const mappingStore = useMappingStore();
const referenceDataStore = useReferenceDataStore();
const paginationStore = usePaginationStore();
const csvStore = useCsvStore();
const productStore = useProductStore();
const modalAlert = ref(null);
const mapFileItem = ref(null);

onMounted(() => {
  modalStore.setModalAlertRef(modalAlert.value);
  modalStore.setMapFileItemRef(mapFileItem.value);
});

function nextPage() {
  paginationStore.nextPage();
  referenceDataStore.getProductsNotInBaselinker(paginationStore.currentPage, paginationStore.itemsPerPage);
}
function prevPage() {
  paginationStore.prevPage();
  referenceDataStore.getProductsNotInBaselinker(paginationStore.currentPage, paginationStore.itemsPerPage);
}
function showPage(page) {
  paginationStore.goToPage(page);
  referenceDataStore.getProductsNotInBaselinker(paginationStore.currentPage, paginationStore.itemsPerPage);
}
</script>

<style scoped>
.page-link {
  cursor: pointer;
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>