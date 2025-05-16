<template>
    <BaseModal ref="parameterModal" title="Add Parameter">
        <template #body>
            <div class="mb-3">
                <label for="parameterName" class="form-label">Parameter Name</label>
                <input type="text" class="form-control" id="parameterName" placeholder="Enter parameter name" v-model="parameterToAdd.name" />
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-secondary" @click="addParameter(parameterToAdd)">Add parameter</button>
        </template>
    </BaseModal>
</template>
<script setup>
import BaseModal from '../base/BaseModal.vue';
import { ref } from 'vue';
import { useReferenceDataStore } from '@/stores/referenceDataStore.js';

const referenceDataStore = useReferenceDataStore();
const parameterModal = ref(null);

function openModal() {
    parameterModal.value.show();
};

function closeModal() {
    parameterModal.value?.hide();
}

function addParameter(parameter) {
    referenceDataStore.addParameter(parameter);
    closeModal();
}

const parameterToAdd = {
    id: crypto.randomUUID(),
    name: "",
    value: "",
    baselinkerId: 0,
};

defineExpose({ openModal, closeModal, });
</script>