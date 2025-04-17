<template>
  <BaseModal ref="mappingMetaModal">
    <template #header>
      <h5 class="modal-title">Add mapping Data</h5>
    </template>
    <template #body>
      <div class="form-floating mb-3">
          <input type="text" v-model="meta.name" class="form-control" id="mappingName" placeholder="Mapping name">
          <label for="mappingName">Mapping name</label>
      </div>
      <div class="form-floating mb-3">
        <input type="text" v-model="meta.title" class="form-control" id="mappingProdTitle" placeholder="Mapping product title">
        <label for="mappingProdTitle">Title</label>
      </div>
      <div class="form-floating mb-3">
        <textarea class="form-control" v-model="meta.description" placeholder="Leave a comment here" id="mappingProdDesc" style="height: 100px"></textarea>
        <label for="mappingProdDesc">Description</label>
      </div>
    </template>
    <template #footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="confirm" class="btn btn-light">Save mapping</button>
    </template>
  </BaseModal>
</template>

<script>
import axios from 'axios';
import BaseModal from '../base/BaseModal.vue';

export default {
components: { BaseModal },
 props: {
    payload: {
        type: Object,
        default: () => ({}),
        required: true
    }
 },
 data() {
    return {
       // modalInstance: null,
        meta: {
            name: '',
            description: '',
            title: '',
            baselinkerCategoryId: 0
        },
        localPayload: {},
        categoriesInBl: [{id: 1, name: 'test', parentId: 0}, {id: 2, name: 'test2', parentId: 0}, {id: 3, name: 'test3', parentId: 0}],
        categoriesInFile: ["test", "test2", "test3"],
    }
 },
 methods: {
    show() {
        this.$refs.mappingMetaModal.show();
   },
    closeModal() {
        this.$refs.mappingMetaModal.hide();
    },
    confirm() {
        this.localPayload = this.payload;
        this.localPayload.description = this.meta.description;
        this.localPayload.name = this.meta.name;
        this.localPayload.title = this.meta.title;

        console.log("Saving mapping to backend...", this.localPayload);

        axios.post('https://localhost:7144/api/mappings', this.localPayload)
            .then(response => {
                console.log("Mapping saved successfully!", response);
            })
            .catch(error => {
              console.error("Error occurred during saving mapping: ", error);
            });
        this.closeModal();
    }
 }
}
</script>

<style scoped>
.modal-content,
.list-group-item {
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>
