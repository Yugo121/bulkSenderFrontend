<template>
    <h2 class="text-center my-3">Parameters</h2>

    <div class="container">
        <div class="row mb-3">
            <div class="col-4">
            </div>
            <div class="col-4">
            </div>
            <div class="col-4 d-flex justify-content-end">
                <button class="btn btn-light" @click="addParameter()">Add parameter</button>
            </div>
        </div>

        <div class="row">
            <div class="col-2"></div>
            <div class="col-8">
                <table class="table table-dark table-bordered">
                    <thead>
                        <tr class="text-center">
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>

                        <tbody>
                            <tr class="text-center" v-for="parameter in referenceDataStore.parameters" :key="parameter.id">
                                <th scope="row">{{ referenceDataStore.parameters.indexOf(parameter) + 1}}</th>
                                <td> {{ parameter.name }} </td>
                                <td>
                                    <div class="d-inline-flex gap-2">
                                        <button class="btn btn-danger btn-sm" aria-label="Delete parameter" @click="referenceDataStore.deleteParameter(parameter)">Delete</button> 
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </div>
            <div class="col-2"></div>
        </div>
    </div>
    <ParameterModal ref="parameterModalRef"></ParameterModal>
</template>

<script setup>
    import { useReferenceDataStore } from '@/stores/referenceDataStore.js'
    import { ref, onMounted } from 'vue';
    import { useModalStore } from '@/stores/modalStore';
    import ParameterModal from '@/components/entities/ParameterModal.vue';

    const referenceDataStore = useReferenceDataStore();
    const modalStore = useModalStore();
    const parameterModalRef = ref(null);

    onMounted(() => {
        referenceDataStore.fetchParameters()
        modalStore.setParameterModalRef(parameterModalRef);
        console.log(referenceDataStore.parameters);
    });

    function addParameter() {
        parameterModalRef.value.openModal();
    }
</script>