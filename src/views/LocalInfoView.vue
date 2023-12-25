<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import PagedTable from "@/components/common/CommonTable.vue";
import { getList, localInfoHeader } from "@/components/rest/LocalInfoRest"
import { type Header, type LocalInfo, type selectValue } from '@/components/type/LocalInfoType'
import { lodingStore } from '@/stores/LodingStore'; 

const store = lodingStore();
const list = ref<Header[]>(localInfoHeader);
const gridData = ref<Array<LocalInfo[]>>([]);
/** 현재 depth값 , 기본값 depth:1,parentCode:9999 */
const selectState = ref<selectValue>({
  depth: 0,
  parentCode: "9999"
});
const popupFlag = ref<boolean>(false);
const detailData = ref<LocalInfo>();

/** girdData 조회  */
const getDeptList = async () => {
  gridData.value = await getList() as Array<LocalInfo[]>;
}

/** 
 *  gridData.value 의 filter 결과 return 
 *  현재 depth && 선택한 depth의 자식 depth값 (selectState.value)
 */
const selectedData = computed(() => {
  return gridData.value[selectState.value.depth]
    .filter(i => i.parentDeptCode === selectState.value.parentCode) as LocalInfo[];
})

/** 선택한 depth가 마지막 depth인지 확인 */
function lastDepthCheck(data:LocalInfo) {
  if(
    gridData.value[data.deptDepth] && 
    gridData.value[data.deptDepth].filter(i => i.parentDeptCode === data.deptCode).length > 0) {
    return true
  } else {
    return false
  }
}

/** 삭제 시 children 확인 */
function checkChildren(data:LocalInfo) {
  return gridData.value[data.deptDepth]
    .filter(i => i.parentDeptCode == data.deptCode).length > 0 ? true : false;
}

/** 선택 시 selectState 값 변경 */
function selectItem(data?: LocalInfo) {
  // data 가 있는 경우
  if (data) {
    // 다음 depth 여부 확인 
      if(lastDepthCheck(data)) {
      // 이동할 뎁스 : data.deptDepth 값을 selectState.depth에 할당
      return [
        selectState.value.depth = data.deptDepth,
        selectState.value.parentCode = data.deptCode
      ]
    } else {
    //   // 다음 depth가 없을 경우
      return alert('마지막depth입니다')
    }
  } else return [
    // 초기값 1depth 
    selectState.value.depth = 0,
    selectState.value.parentCode = "9999"
  ]
}

//** 이전 depth 버튼 클릭  */
function prevData() {
  selectState.value.depth = selectState.value.depth - 1;
  let prevDepth = '';
  gridData.value[selectState.value.depth].forEach(i => {
    if (i.deptCode == selectState.value.parentCode) {
      prevDepth = i.parentDeptCode;
    };
  });
  return selectState.value.parentCode = prevDepth;
}

async function rowDelete(data: LocalInfo) {
  // 하위 depth 여부 확인
  if(checkChildren(data)) {
    alert('children depth 가 있습니다');
    return
  } else {
    if(confirm('삭제하시겠습니까?')) {
      await getDeptList().then(()=> {
        alert('삭제 성공');
      });
    }
  }
}

function detail (data: LocalInfo) {
  popupFlag.value = true;
  detailData.value = {} as LocalInfo;
  detailData.value = data;
}

const init = async () => {
  await getDeptList();
}

onMounted(async () => {
  await init();
})

</script>
<template>
  <div v-if="!store.getStatus" class="flex">
    <h1>{{ '[ ' + selectState.depth + ' depth ]' }}</h1>
    <br/>
    <!-- <div class="fixed bottom-0 left-0 flex"> -->
    <article v-for="(data, index) in gridData" :key="index">
      <article class="flex">
        <PagedTable 
          v-if="index == selectState.depth" 
          :headers="list" 
          :data="selectedData"
          :btn="true"
          :rowId="Object.keys(data).toString()" 
          @click="selectItem($event)"
          @delete="rowDelete($event)"
          @detail="detail($event)"
          >
          <template #deleteBtn />
        </PagedTable>
      </article>
    </article>
  </div>
  <br/>
    <button 
      v-if="selectState.depth !== 0 && !store.getStatus"
      @click="prevData" 
      class="bg-blue-700 text-white h-15 w-30 ml-10 py-2 mt-10 rounded-md shadow-md"
    >이전 depth</button>
</template>