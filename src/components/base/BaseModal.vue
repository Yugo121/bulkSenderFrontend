<template>
    <div class="modal fade" tabindex="-1" ref="modalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- HEADER -->
          <div class="modal-header text-center">
            <h5 class="modal-title fs-5" v-if="!$slots.header">{{ title }}</h5>
            <slot name="header"></slot>
            <button type="button" class="btn-close btn-close-white" @click="hide" aria-label="Close"></button>
          </div>
  
          <!-- BODY -->
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
  
          <!-- FOOTER -->
          <div class="modal-footer justify-content-between">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="hide">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from 'bootstrap';
  
  export default {
    name: 'BaseModal',
    props: {
      title:       { type: String, default: '' },
    },
    data() {
      return { instance: null };
    },
    methods: {
      show() {
        if (!this.instance) {
          this.instance = new Modal(this.$refs.modalEl, {
        backdrop: 'static',
        keyboard: false
      });
        }
        this.instance.show();
      },
      hide() {
        this.instance?.hide();
      }
    }
  };
  </script>

<style scoped>
.modal-content,
.list-group-item {
  background-color: rgb(43, 42, 36);
  color: white;
  border-color: grey;
}

</style>
  