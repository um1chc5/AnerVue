<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { reactive, ref, watch, computed } from 'vue'
import useBoardsStore from 'src/stores/boards'
import TaskModal from '../TaskModal'
import TaskComponent from '../TaskComponent'
import type { BoardType, TaskType } from 'src/types/board'
import { storeToRefs } from 'pinia'
import type { UpdateBoardBody } from 'src/types/api.type'
import { customToast } from 'src/utils/toast'
import { useToast } from 'primevue/usetoast'
import { useMutation } from '@tanstack/vue-query'
import boardApis from 'src/apis/boards.api'
import { cloneDeep, omit } from 'lodash'
import { filterTaskDataForUpdate } from 'src/utils/utils'
import {
  usePreviewBoardsQuery,
  useCurrentBoardQuery,
  useDeleteTaskMutation,
  useCreateTaskMutation
} from 'src/utils/queries'

// TYPE, INTERFACE
type ColumnDataType = { col_id?: string; col_name: string }
type editBoardDataType = { col_list: ColumnDataType[]; board_name: string }
type dragTaskTypeProps = {
  removed?: { element: TaskType }
  added?: { element: TaskType }
}

// GET DATA FROM STORE
const store = useBoardsStore()
const { current_board_id, modalTaskData } = storeToRefs(store)

// QUERY, MUTATION, API REQUEST
const { data: previewAllBoards, refetch: refetchPreviewBoard } = usePreviewBoardsQuery()
const deleteTaskMutation = useDeleteTaskMutation()
const createTaskMutation = useCreateTaskMutation()
const {
  data: currentBoardData,
  isLoading,
  isFetching,
  refetch: refetchCurrentBoard
} = useCurrentBoardQuery(current_board_id)

const updateBoardMutation = useMutation({
  mutationFn: boardApis.updateBoard
})

// DECLARE REFS, VARIABLES, UTILITIES
const router = useRouter()
const route = useRoute()
const modalVisible = ref(false)
const editBoardVisible = ref(false)
const toast = useToast()
const draggableBoardData = ref<BoardType>()
const fetchedColData = computed(
  () =>
    currentBoardData.value?.data?.map((col) => ({
      col_id: col.col_id,
      col_name: col.col_name
    }))
)
const editBoardData: editBoardDataType = reactive({
  col_list: [],
  board_name: ''
})

const initialUpdateBoardReqBody = {
  board_name: '',
  delete_records: [],
  name_changing_records: [],
  new_records: []
}

// This data includes changes in both columns and board (name, quantity)
const updateBoardRequestBody = reactive<Omit<UpdateBoardBody, 'board_id'>>(
  structuredClone(initialUpdateBoardReqBody)
)

// FUNCTION, METHODS
const deleteCol = (col: ColumnDataType, index: number) => {
  if (col.col_id) {
    updateBoardRequestBody.delete_records?.push(col.col_id)
  }
  editBoardData.col_list.splice(index, 1)
}

const submitHandler = () => {
  const { board_name, col_list } = editBoardData

  if (board_name === '') {
    customToast.warning(toast, 'Board name cannot be empty')
    return
  }

  const colNameEmpty = col_list.some((col) => !col.col_name) && col_list.length !== 0
  if (colNameEmpty) {
    customToast.warning(toast, 'Column name cannot be empty')
    return
  }

  if (board_name !== currentBoardData.value?.board_name) {
    updateBoardRequestBody.board_name = board_name
  }

  col_list.forEach((col) => {
    const matchedCol = fetchedColData.value?.find((column) => column.col_id == col.col_id)
    if (!col.col_id) {
      updateBoardRequestBody.new_records?.push(col.col_name)
    } else {
      if (matchedCol && col.col_name !== matchedCol.col_name) {
        updateBoardRequestBody.name_changing_records?.push({
          col_name: col.col_name,
          sort_key: col.col_id
        })
      }
    }
  })

  updateBoardMutation.mutate(
    { ...updateBoardRequestBody, board_id: current_board_id.value },
    {
      onSuccess: () => {
        customToast.success(toast, 'Update columns successfully')
        refetchCurrentBoard()
        refetchPreviewBoard()
        editBoardVisible.value = false
      }
    }
  )
}

const dragTaskHandler = (args: dragTaskTypeProps, col_id: string) => {
  if ('removed' in args) {
    deleteTaskMutation.mutate(
      {
        board_id: current_board_id.value,
        task_id: args.removed?.element.task_id as string
      },
      {
        onSuccess: () => {
          refetchCurrentBoard()
        }
      }
    )
  }
  if ('added' in args) {
    createTaskMutation.mutate({
      ...omit(filterTaskDataForUpdate(args.added?.element as TaskType, current_board_id.value), [
        'sort_key',
        'title'
      ]),
      title: args.added?.element.title as string,
      sort_key: col_id
    })
  }
}

// WATCHERS
watch(route, () => {
  current_board_id.value = route.params.board_id as string
  console.log(route.params)
})

watch(previewAllBoards, () => {
  if (route.path == '/') {
    current_board_id.value = previewAllBoards.value?.[0].board_id as string
    router.push(current_board_id.value)
    return
  }
  current_board_id.value = route.params.board_id as string
})

watch(currentBoardData, () => {
  editBoardData.board_name = currentBoardData.value?.board_name as string
  draggableBoardData.value = cloneDeep(currentBoardData.value) as BoardType
  // console.log(draggableBoardData)
})

watch(editBoardVisible, () => {
  editBoardData.col_list = structuredClone(fetchedColData.value) as ColumnDataType[]
  editBoardData.board_name = currentBoardData.value?.board_name as string
  Object.assign(updateBoardRequestBody, structuredClone(initialUpdateBoardReqBody))
})

// --------------------------
</script>

<template>
  <div class="min-h-screen pl-[300px] pt-[300px] bg-slate-100" v-if="isLoading">
    <h2 class="font-bold text-2xl text-slate-800">Loading...</h2>
  </div>
  <div
    id="board-component"
    class="bg-slate-100 min-h-screen z-0 pt-[108px] ml-[260px] px-6 pb-10 flex gap-6 overflow-x-scroll"
    v-else-if="currentBoardData"
  >
    <div
      v-for="col in (draggableBoardData as BoardType).data"
      :key="col.col_id"
      class="flex flex-col w-[280px] shrink-0"
    >
      <p class="text-sm text-gray-400 font-semibold tracking-widest">
        {{ col.col_name }} ({{ col.tasks.length }})
      </p>
      <draggable
        :class="[
          createTaskMutation.status.value === 'pending' ||
          isFetching ||
          deleteTaskMutation.status.value === 'pending'
            ? 'pointer-events-none opacity-60'
            : ''
        ]"
        :list="col.tasks"
        :item-key="col.col_name"
        group="tasks"
        class="grow"
        @change="(args) => dragTaskHandler(args, col.col_id as string)"
      >
        <template #item="{ element: task }">
          <TaskComponent
            :task="task as TaskType"
            :modal-visible="modalVisible"
            :board="col"
            @update:modal-visible="(msg) => (modalVisible = msg)"
          />
        </template>
      </draggable>
    </div>
    <button
      @click="editBoardVisible = true"
      class="bg-gradient-to-b from-slate-200 w-[280px] shrink-0 flex items-center justify-center rounded-xl duration-100 cursor-pointer text-slate-500 hover:text-green-600"
    >
      <p class="font-bold text-2xl text-center">New Column <br />Edit Board</p>
    </button>
    <TaskModal
      :modal-visible="modalVisible"
      :modal-task-data="modalTaskData || ({} as TaskType)"
      @update:modal-visible="(msg) => (modalVisible = msg)"
    />
    <Dialog
      v-model:visible="editBoardVisible"
      modal
      header="Edit column"
      :style="{ width: '32rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :close-on-escape="true"
      :draggable="false"
    >
      <form class="px-3" @submit.prevent="submitHandler">
        <div class="mb-4">
          <h3 class="text-gray-500 font-semibold mb-2 text-sm">Board name</h3>
          <InputText
            v-model="editBoardData.board_name"
            type="text"
            size="small"
            placeholder="e.g: Vue Route"
            class="w-full"
            @keydown.enter.prevent
          />
        </div>
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-1 text-sm">Columns</p>
          <div
            class="flex gap-3 mb-2"
            v-for="(col, index) in editBoardData.col_list"
            :key="col.col_id"
          >
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
              @click.prevent="deleteCol(col, index)"
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
            @click.prevent="editBoardData.col_list.push({ col_name: '' })"
          />
        </div>
        <Button class="mt-2 w-full" type="submit" label="Save changes" rounded size="small" />
      </form>
    </Dialog>
  </div>
  <div
    v-else
    class="bg-slate-100 min-h-screen z-0 pt-[108px] ml-[260px] px-6 pb-10 flex justify-center items-center gap-6 overflow-x-scroll"
  >
    <h1 class="text-5xl text-gray-400 font-semibold">Choose a board</h1>
  </div>
</template>

<style>
#board-component::-webkit-scrollbar {
  display: none;
}
</style>
src/types/board
