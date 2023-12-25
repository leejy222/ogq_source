import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

//id
export const lodingStore = defineStore('isLoding', () => {
    // state
    const status = ref<boolean>(false);

    //getters
    const getStatus = computed(() => status.value)
    // const getData = computed(() => {
    //     const newData = Object.entries(initData.value);

    //     // key값 변경 후 gridData 에 assign
    //     return newData.reduce((acc, item) => {
    //         acc[item[0].slice(6)] = item[1];
    //         return acc;
    //     }, {} as any);
    // });
    
    //actions
    function isLoding(value:boolean) {
        return status.value = value;
    }

        
    //     initData.value = await useRest().get("/org-dept") as GridData;
    // }

    // const init = async () => {
    //     if(Object.keys(initData.value).length <= 0) {
    //         await apiCall();
    //     }
    // }

    // const addDept = () => {

    //     console.log(initData.value);
    //     const num = Object.keys(initData.value).length + 1;
    //     initData.value['depth_'+num] = initData.value['depth_1'];
    // }


    return {  isLoding ,getStatus }
})
