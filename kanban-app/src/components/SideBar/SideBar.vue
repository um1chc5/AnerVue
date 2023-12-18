<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type ContextMenu from 'primevue/contextmenu'
import { useToast } from 'primevue/usetoast'
import useBoardsStore from 'src/stores/boards'
import type { BoardType } from 'src/types'
import { customToast } from 'src/utils/toast'
import { convertToPath } from 'src/utils/utils'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const store = useBoardsStore()
const { boards } = storeToRefs(store)
const toast = useToast()
const modalVisible = ref(false)
const currentBoardIndex = ref(0)
const newBoardData = ref<BoardType>({
  board_name: '',
  data: [
    {
      col_name: 'Todo',
      tasks: []
    },
    {
      col_name: 'Doing',
      tasks: []
    },
    {
      col_name: 'Done',
      tasks: []
    }
  ],
  path: ''
})

const boardCtxMenuRef = ref<InstanceType<typeof ContextMenu>>()
const showCtxMenu = (event: MouseEvent) => {
  const currentIndex = Number(
    ((event.target as HTMLElement).parentNode as any).attributes[2].nodeValue
  )
  currentBoardIndex.value = currentIndex
  boardCtxMenuRef.value?.show(event)
}

const boardCtxMenuList = ref([
  {
    label: 'Delete'
  }
])

const newBoardSubmit = () => {
  if (!newBoardData.value.board_name) {
    customToast.warning(toast, 'Board name cannot be empty')
    return
  }

  if (newBoardData.value.data.some((col) => !col.col_name)) {
    customToast.warning(toast, 'Column name cannot be empty')
    return
  }

  newBoardData.value.path = convertToPath(newBoardData.value.board_name)

  boards.value.push(newBoardData.value)
  customToast.success(toast, 'Adding board successfully')
  modalVisible.value = false
}
</script>

<template>
  <div class="h-screen bg-white py-8 pr-6 pt-[108px]">
    <h1 class="pl-6 text-sm pb-4 tracking-widest uppercase text-gray-400 font-semibold">
      all boards ({{ boards.length }})
    </h1>
    <div>
      <div @contextmenu="showCtxMenu">
        <RouterLink
          v-for="(board, index) in boards"
          :index="index"
          :key="index"
          :to="board.path"
          active-class="bg-green-600 text-white hover:bg-green-100 hover:text-green-600"
          class="block pl-6 py-4 my-2 list-none hover:bg-green-100 cursor-pointer duration-300 ease-in-out rounded-r-full text-gray-500 font-semibold"
        >
          <p>
            {{ board.board_name }}
          </p>
        </RouterLink>
        <ContextMenu ref="boardCtxMenuRef" :model="boardCtxMenuList">
          <template #item="{ item }">
            <button
              class="px-3 py-2 w-full text-left hover:bg-green-50 duration-200 bg-white"
              @click="boards.splice(currentBoardIndex, 1)"
            >
              {{ item.label }}
            </button>
          </template>
        </ContextMenu>
      </div>
      <button
        @click="modalVisible = true"
        class="w-full text-left block pl-6 py-4 my-2 list-none bg-green-50 hover:bg-green-100 cursor-pointer duration-300 ease-in-out rounded-r-full text-green-600/80 font-bold"
      >
        + Add new board
      </button>
    </div>
    <Dialog
      v-model:visible="modalVisible"
      modal
      header="Add new board"
      :style="{ width: '32rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :close-on-escape="true"
      :draggable="false"
    >
      <form class="px-3" @submit.prevent="newBoardSubmit">
        <div class="mb-4">
          <h3 class="text-gray-500 font-semibold mb-2 text-sm">Board name</h3>
          <InputText
            v-model="newBoardData.board_name"
            type="text"
            size="small"
            placeholder="e.g: Nuxt Project"
            class="w-full"
            @keydown.enter.prevent
          />
        </div>
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-1 text-sm">Columns</p>
          <div class="flex gap-3 mb-2" v-for="(col, index) in newBoardData.data" :key="index">
            <InputText
              v-model="col.col_name"
              type="text"
              size="small"
              placeholder="Column name"
              class="w-full"
              @keydown.enter.prevent
            />
            <button
              class="text-gray-500 flex items-center cursor-pointer"
              @click.prevent="newBoardData.data.splice(index, 1)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Button
            class="mt-2 w-full"
            type="button"
            label="Add new column"
            outlined
            rounded
            size="small"
            @click.prevent="newBoardData.data.push({ col_name: '', tasks: [] })"
          />
        </div>
        <Button class="mt-2 w-full" type="submit" label="Save changes" rounded size="small" />
      </form>
    </Dialog>
  </div>
</template>
