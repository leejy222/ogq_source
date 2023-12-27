import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const spinnerStore = defineStore('spinner', () => {
    // state
    const status = ref<boolean>(false);

    //getters
    const getStatus = computed(() => status.value)
    
    //actions
    function isLoading(value:boolean) {
        return status.value = value;
    }

    return {  isLoading , getStatus }
})
