<template>
<div class="modal fade" ref="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Map file</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <ul class="list-group" v-for="columnName in columnNames">
            <li class="list-group-item">
                <div class="input-group">
                    <label :for="columnName" class="form-label" for="column_name">{{ columnName }}</label>
                </div>
                <select :id="columnName" v-model="selectedMappings[columnName]" class="form-select form-select-lg mb-3">
                        <option v-for="productProperty in productProperties" :value="productProperty">{{ productProperty }}</option>
                    </select>
            </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="mapFile" class="btn btn-light">Map file</button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal-content, .list-group-item {
    background-color: rgb(43, 42, 36);;
    color: white;
}

</style>

<script>
import { Modal } from 'bootstrap';

export default {
    props: {
        columnNames: Array,
        productProperties: Array
    },
    data() {
        return {
            selectedMappings: {},
            modalInstance: null
        }
    },
    mounted() {
        this.modalInstance = new Modal(this.$refs.modal);
    },
    methods: {
        openModal() {
            this.modalInstance.show();
        },
        mapFile() {
            console.log("Mapping file...");
            console.log(this.selectedMappings);
        }
    }
}
</script>