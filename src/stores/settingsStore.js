import { defineStore } from 'pinia';
import axios from 'axios';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
            token: '',
            catalogueId: 0,
            warehouseId: 0,
    }),
    actions: {
        async saveSettingData(settings) {
            let secrets = [];
            
            Object.entries(settings).forEach(([key, value]) => {
                secrets.push({
                    id: crypto.randomUUID(),
                    name: key,
                    value: value
                });
            });
            console.log('Zapisuję ustawienia:', secrets);
            try {
                const response = await axios.post('https://localhost:7144/api/secrets', secrets, {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
                console.log('Ustawienia zostały pomyślnie zapisane:', response.data);
            } catch (error) {
                console.error('Błąd podczas zapisywania ustawień:', error);
            }
        }
    }
})