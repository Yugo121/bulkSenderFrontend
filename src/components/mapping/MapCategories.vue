<template>
    <BaseModal ref="mapCategories" :title="title">
        <template #body>
                <ul class="list-group">
                    <li :id="category" v-for="category in mappingStore.getCategoriesFromFile()" :key="category" class="list-group">
                        <div class="input-group mb-3">
                            <label :for="category" class="form-label">Category of name <b>{{ category }}</b> in file:</label>
                        </div>
                        <select 
                        @change="mappingStore.assignCategoryIdInBl(category, $event.target.value)" 
                        class="form-select form-select-lg mb-3"
                        v-model="mappingStore.mappedCategories[category]">
                            <option value="" disabled>Choose category</option>
                            <option  v-for="categoryInBl in referenceDataStore.blCategories" :value="categoryInBl.id">{{ categoryInBl.name }}</option>
                        </select>
                    </li>
                </ul>
                <div class="form-check mt-3">
                    <input class="form-check-input" type="checkbox" id="saveMapping" v-model="mappingStore.saveMapping" />
                    <label class="form-check-label" for="saveMapping">
                        Save mapping
                    </label>
                </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="mappingStore.sendFile(mappingStore.productsPayload)" class="btn btn-light">Save mapping</button>
        </template>
    </BaseModal>

    <MappingMetaModal ref="mappingMetaModal" />
</template>

<script setup>
import BaseModal from '../base/BaseModal.vue';
import { useMappingStore } from '@/stores/mappingStore';
import { useModalStore } from '@/stores/modalStore';
import { useReferenceDataStore } from '@/stores/referenceDataStore';
import { ref, onMounted } from 'vue';
import MappingMetaModal from './MappingMetaModal.vue';

const mapCategories = ref(null);
const mappingMetaModal = ref(null);
const mappingStore = useMappingStore();
const modalStore = useModalStore();
const referenceDataStore = useReferenceDataStore();
const title = "Map file categories with baselinker.";

function show() {
    this.$refs.mapCategories.show();
}
function closeModal() {
    this.$refs.mapCategories.hide();
}

onMounted(() => {
    referenceDataStore.fetchBaselinkerCategories();
    modalStore.setMappingMetaModalRef(mappingMetaModal.value);
})

defineExpose({
    show, closeModal
});
</script>