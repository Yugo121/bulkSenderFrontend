import { defineStore } from 'pinia';
import Papa from 'papaparse';

export const useCsvStore = defineStore('csv', {
    state: () => ({
        file: null,
        rawCsvData: [],
        csvColumnFields: []
    }),
    actions: {
        onFileChange (e) { 
            this.file = e.target.files[0];
            console.log("File selected: ", this.file);
          },
          proccessFile () {
            console.log("Sending file...");
      
            if(!this.file) {
              this.modalMessage = 'Please select a file to upload.';
              this.modalAlertRef.openModal();
              return;
            }
            const fileExtension = this.file.name.split('.').pop().toLowerCase();
      
            if(fileExtension != 'csv') {
              this.modalMessage = 'Invalid file type. Please upload a CSV file.';
              this.modalAlertRef.openModal()
              return;
            }
      
            Papa.parse(this.file, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
      
                if (!results.data.length) {
                  this.modalMessage = 'The uploaded CSV file is empty or incorrectly formatted.';
                  this.modalAlertRef.openModal();
                  return;
                }
      
                this.csvColumnFields = Object.keys(results.data[0] || {});
                this.rawCsvData = results.data;
      
                this.mapFileItemRef.openModal();
                 }
            });
        },
    }
});