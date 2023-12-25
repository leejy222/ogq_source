import { type Header, type LocalInfo } from '../type/LocalInfoType'
import { lodingStore } from '@/stores/LodingStore'; 

const store = lodingStore();

export const localInfoHeader: Array<Header> = [
    { key: "deptName", label: "지역명" },
];

export async function getList() {
    store.isLoding(true);
    try {
        const result =  await fetch("http://localhost:5174/list")
        setTimeout(()=> {
            store.isLoding(false);
        },500)
        return await result.json()
    } catch (e: any) {
        store.isLoding(false);
        return e.status;
    }
}