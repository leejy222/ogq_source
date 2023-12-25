<script lang="ts" setup generic="T extends {[key: string]: any}">
export type Header = {
  key: string
  label: string
};

type Props = {
  headers: Header[]
  data: T[]
  rowId: string
  btn?: boolean
};

defineProps<Props>();

const emit = defineEmits<{
  click: [row: T],
  delete: [row: T],
  detail: [row:T]
}>();

</script>
<template>
  <div class="flex flex-col mt-8">
    <div class="flex justify-center">
      <table class="w-full text-left">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key" scope="col" class="px-3 py-3">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in data"
            :key="row[rowId]"
            class="cursor-pointer border"
            @keydown.enter="() => {
              emit('click', row)
            }"
          >
            <template v-for="header in headers" :key="header.key">
              <td class="px-8 py-7"    
                @click="() => {
                emit('click', row)
              }">
                {{ row[header.key] }}
              </td>
            </template>
            <template v-if="btn ?? false">
                <slot name="deleteBtn">
                  <button @click="() => {
                      emit('delete', row)
                    }" 
                    class="bg-red-500 text-white h-10 w-20 ml-10 py-2 mt-5 rounded-md"
                  >삭제</button>
                  <button @click="() => {
                      emit('detail', row)
                    }" 
                  class="bg-green-500 text-white h-10 w-20 ml-10 mr-5 py-2 mt-2 rounded-md"
                  >상세</button>
                </slot>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>