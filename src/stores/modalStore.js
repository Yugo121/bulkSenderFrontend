import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
    state: () => ({
        refs: {}
    }),
    actions: {
        register(name, refInstance) {
            this.refs[name] = refInstance
          },
        open(name) {
            if (this.refs[name] && typeof this.refs[name].show === 'function') {
              this.refs[name].show()
            }
        },
        close(name) {
            if (this.refs[name] && typeof this.refs[name].hide === 'function') {
              this.refs[name].hide()
            }
        }  
    }
});