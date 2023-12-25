import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { spinnerStore } from '@/stores/SpinnerStore'; 
import { type Header, type LocalInfo, type selectValue } from '@/components/type/LocalInfoType'

const spinner = spinnerStore();

export const localInfoHeader: Array<Header> = [
    { key: "parentDeptName", label: "상위 지역명" },
    { key: "deptName", label: "지역명" },
];


export const localInfoStore = defineStore('localInfo', () => {
    /** state */
    const gridData = ref<Array<LocalInfo[]>>([]);
    // 현재 depth값 , 기본값 depth:0,parentCode:9999
    const selectState = ref<selectValue>({
        depth: 0,
        parentCode: "9999"
      });
    
    /** getters */
    const getGridData = computed(() => gridData.value)
    const getSelectState = computed(() => selectState.value)
    // gridData.value 의 filter 결과 return 
    // 현재 depth && 선택한 depth의 자식 depth값 (selectState.value)
    const getSelectedData = computed(() => {
        return gridData.value[selectState.value.depth]
          .filter(i => i.parentDeptCode === selectState.value.parentCode) as LocalInfo[];
      })
      
    /** actions */
    // list 가져오기
    const getList = async() => {
        spinner.isLoding(true);
        try {
            const result =  await fetch("http://localhost:5174/list")
            setTimeout(()=> {
                spinner.isLoding(false);
            },500)
            gridData.value = await result.json()
        } catch (e: any) {
            spinner.isLoding(false);
            alert(e);
        }
    }

    /** 선택한 depth가 마지막 depth인지 확인 */
    function lastDepthCheck(data:LocalInfo) {
        if(
          getGridData.value[data.deptDepth] && 
          getGridData.value[data.deptDepth].filter(i => i.parentDeptCode === data.deptCode).length > 0) {
          return true
        } else {
          return false
        }
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
    function prev() {
        selectState.value.depth = selectState.value.depth - 1;
        let prevDepth = '';
        gridData.value[selectState.value.depth].forEach(i => {
        if (i.deptCode == selectState.value.parentCode) {
            prevDepth = i.parentDeptCode;
        };
        });
        return selectState.value.parentCode = prevDepth;
    }

    /** 삭제 시 children 확인 */
    function checkChildren(data:LocalInfo) {
        return  gridData.value[data.deptDepth] == undefined ? false : gridData.value[data.deptDepth]
        .some(i => i.parentDeptCode == data.deptCode) ? true : false;
    }

    /** Data초기화 */
    const initData = () => {
        gridData.value = [];
        selectState.value = {depth: 0, parentCode: "9999"}
    }

    
    return { getList , selectItem , initData , prev , checkChildren , getSelectedData , getGridData , getSelectState }
})
