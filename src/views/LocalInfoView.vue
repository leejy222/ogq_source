<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import PagedTable from "@/components/common/CommonTable.vue";
import { type Header, type LocalInfo } from '@/components/type/LocalInfoType'
import { storeToRefs } from 'pinia';
import { spinnerStore } from '@/stores/SpinnerStore'; 
import { localInfoStore, localInfoHeader } from '@/stores/LocalInfoStore'; 

const spinner = spinnerStore();
const store = localInfoStore();
const { getGridData, getSelectState, getSelectedData } = storeToRefs(store);

const list = ref<Header[]>(localInfoHeader);

//** 이전 depth 버튼 클릭  */
function prevData() {
  store.prev();
}

async function rowDelete(data: LocalInfo) {
  // 하위 depth 여부 확인
  if(store.checkChildren(data)) {
    alert('children depth 가 있습니다');
    return
  } else {
    if(confirm('삭제하시겠습니까?')) {
      await store.getList().then(()=> {
        alert('삭제 성공');
      });
    }
  }
}

const init = async () => {
  store.initData();
  await store.getList();
}

onMounted(async () => {
  await init();
})

</script>
<template>
  <div v-if="!spinner.getStatus" class="flex">
    <h1>{{ '[ ' + getSelectState.depth + ' depth ]' }}</h1>
    <br/>
    <article v-for="(data, index) in getGridData" :key="index">
      <article class="flex">
        <PagedTable 
          v-if="index == getSelectState.depth" 
          :headers="list" 
          :data="getSelectedData"
          :btn="true"
          :rowId="Object.keys(data).toString()" 
          @click="store.selectItem($event)"
          @delete="rowDelete($event)"
          >
          <template #deleteBtn />
        </PagedTable>
      </article>
    </article>
  </div>
  <br/>
    <button 
      v-if="store.getSelectState.depth !== 0 && !spinner.getStatus"
      @click="prevData" 
      class="bg-blue-700 text-white h-15 w-30 ml-10 py-2 mt-10 rounded-md shadow-md"
    >이전 depth</button>
</template>