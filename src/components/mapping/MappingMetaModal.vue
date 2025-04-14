<template>
    <div class="modal" tabindex="-1" ref="mappingMetaModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add mapping Data</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating mb-3">
                        <input type="text" v-model="meta.name" class="form-control" id="floatingInput" placeholder="name@example.com">
                        <label for="floatingInput">Mapping name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" v-model="meta.title" class="form-control" id="floatingPassword" placeholder="Password">
                        <label for="floatingPassword">Title</label>
                    </div>
                    <div class="form-floating mb-3">
                        <textarea class="form-control" v-model="meta.description" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                        <label for="floatingTextarea2">Description</label>
                    </div>                                               
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click="confirm" class="btn btn-light">Save mapping</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import axios from 'axios';

export default {
 props: ['payload'],
 data() {
    return {
        modalInstance: null,
        meta: {
            name: '',
            description: '',
            title: ''
        },
        localPayload: {}
    }
 },
 methods: {
    show() {
        this.$nextTick(() => {
    this.localPayload = this.payload;
    const modalEl = this.$refs.mappingMetaModal;
    if (!this.modalInstance) {
      this.modalInstance = new Modal(modalEl, {
        backdrop: 'static',
        keyboard: false
      });
    }
    this.modalInstance.show();
  });
   },
    closeModal() {
        this.modalInstance.hide();
    },
    confirm() {
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
