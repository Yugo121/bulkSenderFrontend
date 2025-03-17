<template>
  <div ref="modal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Something went wrong!</h5>
                <button type="button" class="btn-close btn-close-white" @click="closeModal "aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="closeModal">Close</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
    props: {
        message: String,
    },
    emits: ['close'],
    data() {
        return {
            modalInstance: null,
        }
    },
    methods: {
        openModal() {
            if(!this.modalInstance) {
                this.modalInstance = new Modal(this.$refs.modal);
            }
            this.modalInstance.show();
        },
        closeModal() {
            if(this.modalInstance) {
                this.modalInstance.hide();
            }
            this.$emit('close');
        }
    },
}
</script>

<style scoped>
.modal-content {
    background-color: rgb(43, 42, 36);
    color: white;
}
</style>