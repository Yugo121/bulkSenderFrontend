import { defineStore } from 'pinia';
import { useReferenceDataStore } from './referenceDataStore';
import axios from 'axios';

export const useProductStore = defineStore('product', {
    state: () => ({
        productsNotInBl: [],
        productsNotInBlCount: 0,
        showNotSent: false,
        isProcessing: false,
    }),
    actions: {
        saveEditedProduct(product) {
            const referenceDataStore = useReferenceDataStore();
            const index = this.productsNotInBl.findIndex(p => p.id === product.id,
                  {
                 headers: {
                'Content-Type': 'application/json; charset=utf-8'
                 }
                }
            );
            if (index !== -1) {
                this.productsNotInBl[index] = product;
                referenceDataStore.saveEditedProduct(product);
            } else {
                this.productsNotInBl.push(product);
            }
        },
        async sendProductsData(products) {
            const mappedProducts = products.map(this.mapProductToDTO);
            try{
                const response = await axios.post('https://localhost:7144/api/products/addMany', mappedProducts);
                console.log('Produkty zostały pomyślnie wysłane:', response.data);
            } catch (error) {
                console.error('Błąd podczas wysyłania produktów:', error);
                this.errorMessage = 'Błąd wysyłania danych: ' + (error.response?.data?.message || error.message);
            }
        },
        parseCsvLine(line) {
            let separator = ';';
            const result = [];
            let currentField = '';
            let inQuotes = false;

            for(let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    if( inQuotes && line[i + 1] === '"') {
                        currentField += '"';
                        i++; 
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === separator && !inQuotes) {
                    result.push(currentField);
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            result.push(currentField);
            
            return result;
        },
        handleFileUpload(event) {
            console.log('Plik został wybrany:', event.target.files);
            const file = event.target.files[0];
            if (!file) return;
            
            this.errorMessage = null;
            
            this.processCsvFile(file);
        },
        processCsvFile(file) {
            console.log('Przetwarzanie pliku CSV:', file.name);
            this.isProcessing = true;
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    console.log('Plik CSV został wczytany:', file.name);
                    const content = e.target.result;
                    const products = this.convertCsvToProduct(content);
                    console.log('Produkty przetworzone z pliku CSV:', products);

                    this.sendProductsData(products);

                } catch (error) {
                    console.error('Błąd podczas przetwarzania pliku CSV:', error);
                    this.errorMessage = 'Błąd przetwarzania: ' + error.message;
                } finally {
                    this.isProcessing = false;
                }
            };
            
            reader.onerror = () => {
                console.error('Błąd odczytu pliku:', file.name);
                this.errorMessage = 'Nie można odczytać pliku';
                this.isProcessing = false;
            };
            
            reader.readAsText(file, 'UTF-8');
            console.log('Rozpoczęto odczyt pliku...');
        },
        convertCsvToProduct(content) {
            console.log('Konwersja pliku CSV na produkty...');
            
            const lines = content.split(/\r?\n/).filter(line => line.trim());
            
            console.log('Pierwsze 3 linie:', lines.slice(0, 3));
            
            if (lines.length < 2) {
                throw new Error('Plik CSV musi zawierać nagłówki i przynajmniej jeden wiersz danych');
            }

            const headers = this.parseCsvLine(lines[0]);

            const headersMap = {
                'family_id': 'baselinkerParentId',
                'produkt_id': 'baselinkerId', 
                'produkt_ean': 'ean',
                'produkt_sku': 'sku',
                'producent_nazwa': 'brand.name',
                'kategoria_nazwa': 'category.baselinkerName',
            };

            const products = [];
            let processedCount = 0;
            let skippedCount = 0;
            
            for (let i = 1; i < lines.length; i++) {
                const values = this.parseCsvLine(lines[i]);
                
                if (values.length === 0 || values.every(val => !val.trim())) {
                    skippedCount++;
                    continue;
                }

                let product = {
                    id: null,
                    baselinkerId: null,
                    baselinkerParentId: null,
                    category: {baselinkerName: "", baselinkerId: null, id: null, aliases: [{name: "", id: null, categoryId: null}]},
                    brand: {name: "", baselinkerId: null, description: "", id: null},
                    ean: "",
                    sku: "",
                    name: "",
                    description: "",
                    price: null,
                    isAddedToBaselinker: true,
                    parameters: [{name: "", value: "", id: null}],
                };

                if (i <= 5) {
                    console.log(`Wiersz ${i}:`, values);
                }

                headers.forEach((header, index) => {
                    const normalizedHeader = header.trim().toLowerCase();
                    const productProperty = headersMap[normalizedHeader];

                    if (productProperty && values[index] !== undefined) {
                        let value = values[index].trim();
                        
                        if (i <= 3) {
                            console.log(`Mapuję: "${normalizedHeader}" -> "${productProperty}" = "${value}"`);
                        }
                        
                        if (['id', 'baselinkerId', 'baselinkerParentId', 'categoryBlId'].includes(productProperty)) {
                            value = value ? parseInt(value) || null : null;
                        }
                        
                        if (productProperty.includes('.')) {
                            this.setNestedProperty(product, productProperty, value || "");
                        } else {
                            product[productProperty] = value || (typeof product[productProperty] === 'string' ? "" : null);
                        }
                    }
                });
                
                products.push(product);
                processedCount++;
                
                if (i <= 3) {
                    console.log(`Produkt ${i}:`, product);
                }
            }

            console.log(`Konwersja zakończona:`);
            console.log(`Przetworzono: ${processedCount} produktów`);
            console.log(`Pominięto: ${skippedCount} pustych wierszy`);
            console.log(`Pierwszy produkt:`, products[0]);
            console.log(`Ostatni produkt:`, products[products.length - 1]);
            
            return products;
        },
        setNestedProperty(obj, path, value) {
            const keys = path.split('.');
            let current = obj;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
        },
        mapProductToDTO(product) {
        return {
        id: product.id ?? "00000000-0000-0000-0000-000000000000", // fallback na pusty GUID
        baselinkerId: product.baselinkerId ?? 0,
        baselinkerParentId: product.baselinkerParentId ?? 0,
        isAddedToBaselinker: product.isAddedToBaselinker ?? false,
        sku: product.sku || "",
        ean: product.ean || "",
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? 0.0,
        category: {
            id: product.category?.id ?? "00000000-0000-0000-0000-000000000000",
            baselinkerId: product.category?.baselinkerId ?? 0,
            baselinkerName: product.category?.baselinkerName || "",
            aliases: (product.category?.aliases || []).map(alias => ({
                id: alias.id ?? "00000000-0000-0000-0000-000000000000",
                name: alias.name || "",
                categoryId: alias.categoryId ?? "00000000-0000-0000-0000-000000000000"
            }))
        },
        brand: {
            id: product.brand?.id ?? "00000000-0000-0000-0000-000000000000",
            baselinkerId: product.brand?.baselinkerId ?? 0,
            name: product.brand?.name || "",
            description: product.brand?.description || ""
        },
        parameters: (product.parameters || []).map(p => ({
            id: p.id ?? "00000000-0000-0000-0000-000000000000",
            baselinkerId: p.baselinkerId ?? 0,
            name: p.name || "",
            value: p.value || ""
        }))
    };
}
    }
});

