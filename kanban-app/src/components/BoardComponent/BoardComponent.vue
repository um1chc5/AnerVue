<script setup lang="ts">
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { computed, ref, watch, watchEffect } from 'vue'
import useBoardsStore from 'src/stores/boards'
import TaskModal from '../TaskModal'
import type { BoardType, TaskType } from 'src/types'
import TaskComponent from '../TaskComponent'
import { boardFiltering } from 'src/utils/utils'
import { customToast } from 'src/utils/toast'
import { useToast } from 'primevue/usetoast'

// Khai báo ref
const store = useBoardsStore()
const route = useRoute()
const { boards, modalDataMarker } = store
const modalVisible = ref(false)
const editColVisible = ref(false)
const filteredBoard = computed(() => boardFiltering(boards, route))
const columnsData = computed(
  () =>
    filteredBoard.value?.data.map((col, index) => ({
      col_index: index,
      col_name: col.col_name
    }))
)

const initialNewCol = {
  columns: columnsData.value,
  board_name: filteredBoard.value?.board_name
}

const newColData = ref(initialNewCol)
const toast = useToast()
// --------------------------
// Watch các thứ
watchEffect(() => {
  // console.log(boards)
  boards.forEach((board) => {
    board.data.forEach((colData) =>
      colData.tasks.forEach((task, index) => {
        task.id = index + 1
      })
    )
  })
  // console.log(boards)
})

watchEffect(() => {
  newColData.value.columns = columnsData.value
  newColData.value.board_name = filteredBoard.value?.board_name
})

watch(editColVisible, () => {
  console.log('hehe', initialNewCol)
  newColData.value = { ...initialNewCol }
  // Ở chỗ này tại sao khi assign initialNewcol không dest thì giá trị vẫn sẽ k được reset?
  // Phải chăng Vue Engine nghĩ mình vẫn đang trỏ vào vùng nhớ cũ của object initial nên nó sẽ không gán lại giá trị?
})

// --------------------------
// HANDLE DATA CÁC THỨ
const handleOpenModal = (board_name: string, col_name: string, title: string, id: number) => {
  modalDataMarker.board_name = board_name
  modalDataMarker.col_name = col_name
  modalDataMarker.task_title = title
  modalDataMarker.taskId = id
  modalVisible.value = !modalVisible.value
}

const modalTaskData = computed(() => {
  const data = boards
    .find((board) => board.board_name === modalDataMarker.board_name)
    ?.data.find((col) => col.col_name === modalDataMarker.col_name)
    ?.tasks.find((task) => task.id === modalDataMarker.taskId)
  return data as TaskType
})

const newColSubmit = () => {
  if (
    columnsData.value === newColData.value?.columns &&
    filteredBoard.value?.board_name === newColData.value?.board_name
  ) {
    return
  }

  if (newColData.value?.board_name === '') {
    customToast.warning(toast, 'Board name cannot be empty')
    return
  }

  const colNameEmpty =
    newColData.value?.columns.some((col) => !col.col_name) && newColData.value.columns.length !== 0
  if (colNameEmpty) {
    customToast.warning(toast, 'Column name cannot be empty')
    return
  }

  filteredBoard.value.board_name = newColData.value.board_name

  const colsNumberCompare = newColData.value.columns.length - filteredBoard.value.data.length

  if (colsNumberCompare !== 0) {
    filteredBoard.value.data = filteredBoard.value.data.filter((_, index) =>
      newColData.value.columns.some((col) => col.col_index === index)
    )
  }

  if (colsNumberCompare > 0) {
    newColData.value.columns.forEach((col) => {
      if (col.col_index > columnsData.value.length - 1) {
        filteredBoard.value.data.push({
          col_name: col.col_name,
          tasks: []
        })
      }
    })
  }

  newColData.value.columns.forEach((col) => {
    filteredBoard.value.data[col.col_index].col_name = col.col_name
  })
  editColVisible.value = false
}

// --------------------------
</script>

<template>
  <div
    id="board-component"
    class="bg-slate-100 min-h-screen z-0 pt-[108px] ml-[260px] px-6 pb-10 flex gap-6 overflow-x-scroll"
  >
    <div
      v-for="(board, index) in filteredBoard?.data"
      :key="index"
      class="flex flex-col w-[280px] shrink-0"
    >
      <p class="text-sm text-gray-400 font-semibold tracking-widest">
        {{ board.col_name }} ({{ board.tasks.length }})
      </p>
      <draggable
        :list="board.tasks"
        :item-key="board.col_name"
        group="tasks"
        class="cursor-pointer grow"
      >
        <template #item="{ element: task }">
          <TaskComponent
            :task="task as TaskType"
            :handle-open-modal="handleOpenModal"
            :filtered-board="filteredBoard"
            :board="board"
          />
        </template>
      </draggable>
    </div>
    <button
      @click="editColVisible = true"
      class="bg-gradient-to-b from-slate-200 w-[280px] shrink-0 flex items-center justify-center rounded-xl duration-100 cursor-pointer text-slate-500 hover:text-green-600"
    >
      <p class="font-bold text-2xl text-center">New Column <br />Edit Column</p>
    </button>
    <TaskModal
      :modal-visible="modalVisible"
      :modal-task-data="modalTaskData || ({} as TaskType)"
      @update:modal-visible="(msg) => (modalVisible = msg)"
      :filtered-board="filteredBoard || ({} as BoardType)"
    />
    <Dialog
      v-model:visible="editColVisible"
      modal
      header="Edit column"
      :style="{ width: '32rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :close-on-escape="true"
      :draggable="false"
    >
      <form class="px-3" @submit.prevent="newColSubmit">
        <div class="mb-4">
          <h3 class="text-gray-500 font-semibold mb-2 text-sm">Board name</h3>
          <InputText
            v-model="newColData.board_name"
            type="text"
            size="small"
            placeholder="e.g: Vue Route"
            class="w-full"
            @keydown.enter.prevent
          />
        </div>
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-1 text-sm">Columns</p>
          <div class="flex gap-3 mb-2" v-for="(col, index) in newColData.columns" :key="index">
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
              @click.prevent="newColData.columns.splice(index, 1)"
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
            @click.prevent="
              newColData.columns.push({ col_index: columnsData.length, col_name: '' })
            "
          />
        </div>
        <Button class="mt-2 w-full" type="submit" label="Save changes" rounded size="small" />
      </form>
    </Dialog>
  </div>
</template>

<style>
#board-component::-webkit-scrollbar {
  display: none;
}
</style>
