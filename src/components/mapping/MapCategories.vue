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
                        :value="mappingStore.mappedCategories[category]">
                            <option value="" disabled>Choose category</option>
                            <option  v-for="categoryInBl in referenceDataStore.blCategories" :value="categoryInBl.id">{{ categoryInBl.name }}</option>
                        </select>
                    </li>
                </ul>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="confirm" class="btn btn-light">Save mapping</button>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '../base/BaseModal.vue';
import { useMappingStore } from '@/stores/mappingStore';
import { useReferenceDataStore } from '@/stores/referenceDataStore';
import { ref, onMounted } from 'vue';

const mapCategories = ref(null);
const mappingStore = useMappingStore();
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
})

// jest już fajnie zrobione, trzeba tylko zmienić w mappingStore metodzix, aka rozbić go na 2 (sendFile), do tworzenia pejlołdu jedna metoda i ona będzie
// produkty przekazywać do tego modala, a druga robi wysyłańsko, też już z tego jak kategorie będą przypisane porpawnie z id z bla. 
function confirm() {
    console.log(mappingStore.mappedCategories);
    this.$refs.mapCategories.hide();
}
defineExpose({
    show, closeModal
});

</script>