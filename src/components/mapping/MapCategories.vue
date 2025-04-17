<template>
    <BaseModal ref="mapCategories" :title="title">
        <template #body>
            <div class="modal-body">
                <ul class="list-group">
                    <li v-for="category in categoriesInFile" :key="category" class="list-group">
                        <div class="input-group mb-3">
                            <label :for="category" class="form-label">Category of name <b>{{ category }}</b> in file:</label>
                        </div>
                        <select class="form-select form-select-lg mb-3">
                            <option value="" disabled>Choose category</option>
                            <option v-for="categoryInBl in categoriesInBl" :value="categoryInBl.id">{{ categoryInBl.name }}</option>
                        </select>
                    </li>
                </ul>
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="confirm" class="btn btn-light">Save mapping</button>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from '../base/BaseModal.vue';

//Przemyśleć sposób ogarniania kategorii na backendzie. Wysyłać i sprawdzać po nazwie i potem zwracać to czego nie znalazło do mapowania? Mapować od razu i wysyłać 
//i dodawać tylko nie zmapowane? Poprawić na backendzie dodawanie obiektu do bazy, zrobić akcje do bla, i popróbować już dodawać testowe itemksy. 

export default {
    components: { BaseModal },
    props: ['products'],
    data () {
        return {
            categoriesInBl: ['buty', 'spodnie', 'koszulka'],
            categoriesInFile: [],
            title: "Map file categories with baselinker.",
        };
    },
    onMounted() {
       
    },
    methods: {
        show() {
            this.$refs.mapCategories.show();
        },
        closeModal() {
            this.$refs.mapCategories.hide();
        },
        confirm() {
            this.$refs.mapCategories.hide();
        },
        getCategoriesName(){
            this.categoriesInFile = this.products.map(p => p.category); 
        }
    }
}
</script>