import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    showModal: false,
    modalMessage: '',
    mapFileItemRef: null,
    modalAlertRef: null,
    mappingMetaModalRef: null,
    brandModalRef: null,
    modalInstance: null,
    categoryModalRef: null,
  }),
  actions: {
    setMapFileItemRef(ref) {
      this.mapFileItemRef = ref;
    },
    setModalAlertRef(ref) {
      this.modalAlertRef = ref;
    },
    setMappingMetaModalRef(ref) {
      this.mappingMetaModalRef = ref;
    },
    setCategoryModalRef(ref) {
      this.categoryModalRef = ref;
    },
    setBrandModalRef(ref) {
      this.brandModalRef = ref;
    },
  }
});
