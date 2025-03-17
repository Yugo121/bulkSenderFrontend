<template>
    <h1 class="text-center mt-3 mb-3">Settings</h1>
    <div class="container">
        <div class="row">
            <div class="col"></div>
            <div class="col-10">
                <p>Here you can configure the settings for the Bulk Sender application.</p>
                <div class="mb-3">
                    <label for="api-key" class="form-label">Paste Baselinker API key here: </label>
                    <input type="password" v-model="apiKey" class="form-control" id="api-key" placeholder="API key">
                </div>
                <div class="mb-3">
                    <h2>Configure mapping:</h2>
                    <h3>Reqiured fields:</h3>
                    <ul>
                        <li v-for="(value, key) in product" :key="key">
                            <div class="form-check">
                                <label :for="key" class="form-check-label">{{ key }}</label>
                                <input type="checkbox" class="form-check-input" :id="key" :placeholder="key" v-model="product[key]">
                            </div>
                        </li>
                    </ul>
                </div>
                <button @click="saveSettings" class="btn btn-light">Save settings</button>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            apiKey: '',
            product: {
                ean: false,
                sku: false,
                quantity: false,
                name: false,
                category: false,
                brand: false,
                size: false,
                gender: false,
                color: false,
                price: false,
                description: false,
                brandDescription: false,
                mainImage: false,
                secondImage: false,
                thirdImage: false,
                fourthImage: false,
            }
        }
    },
    methods: {
        saveSettings () {
            console.log("Product required fields: ");
            for (const [key, value] of Object.entries(this.product)) {
                if (value) {
                    console.log(key);
                }
            }
            console.log("API key: " + this.apiKey);
            console.log('Settings saved!')
        }
    }
}
</script>