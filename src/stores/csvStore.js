import { defineStore } from 'pinia';
import { useModalStore } from './modalStore';
import Papa from 'papaparse';

export const useCsvStore = defineStore('csv', {
  state: () => ({
    file: null,
    csvColumnFields: [],
    rawCsvData: []
  }),
  actions: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    processFile() {
      const modalStore = useModalStore();
      if (!this.file) {
        modalStore.modalMessage = 'Please select a file to upload.';
        modalStore.modalAlertRef.openModal();
        return;
      }
      const ext = this.file.name.split('.').pop().toLowerCase();
      if (ext !== 'csv') {
        modalStore.modalMessage = 'Invalid file type. Please upload a CSV file.';
        modalStore.modalAlertRef.openModal();
        return;
      }
      Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data.length) {
            modalStore.modalMessage = 'Empty or badly formatted CSV.';
            modalStore.modalAlertRef.openModal();
            return;
          }
          this.csvColumnFields = Object.keys(results.data[0] || {});
          this.rawCsvData = results.data;
          modalStore.mapFileItemRef.openModal();
        }
      });
    }
  },
  getters: {},
});
