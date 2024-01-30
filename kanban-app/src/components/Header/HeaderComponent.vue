<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import useBoardsStore from 'src/stores/boards'
import type { CreateTaskBody } from 'src/types/api.type'
import { computed, ref, watch } from 'vue'
import { useCurrentBoardQuery, useCreateTaskMutation } from 'src/utils/queries'
import { customToast } from 'src/utils/toast'
import { cloneDeep } from 'lodash'
import type { Subtask } from 'src/types'

// GET DATA FROM STORE
const store = useBoardsStore()
const { current_board_id, colList } = storeToRefs(store)

// DECLARE REFS, VARIABLES, UTILITIES
const modalVisible = ref(false)
const toast = useToast()
const initialNewTask = computed(() => ({
  board_id: current_board_id.value,
  sort_key: colList.value?.[0].col_id as string,
  title: '',
  description: '',
  subtasks: [
    {
      id: 1,
      done: false,
      title: ''
    }
  ]
}))
const newTaskData = ref<CreateTaskBody>(structuredClone(initialNewTask.value))

// API, MUTATION
const { data: currentBoardData, refetch } = useCurrentBoardQuery(current_board_id)
const createTaskMutation = useCreateTaskMutation()

// WATCHERS
watch(
  colList,
  () => {
    newTaskData.value.sort_key = colList.value?.[0].col_id as string
    // console.log(newTaskData.value)
  },
  { deep: true }
)

watch(current_board_id, () => {
  if (current_board_id.value) newTaskData.value.board_id = current_board_id.value
})

watch(currentBoardData, () => {
  colList.value = currentBoardData.value?.data?.map<{ col_id: string; col_name: string }>(
    (col) => ({
      col_id: col.col_id as string,
      col_name: col.col_name
    })
  )
})

const taskEditSubmit = () => {
  const { subtasks, title } = newTaskData.value
  if (title === '') {
    customToast.warning(toast, 'Task name cannot be empty')
    return
  }

  if (subtasks) {
    const isSubtaskEmpty =
      subtasks.some((subtask: Subtask) => !subtask.title) && subtasks.length !== 0
    if (isSubtaskEmpty) {
      customToast.warning(toast, 'Subtask title cannot be empty')
      return
    }
  }

  createTaskMutation.mutate(newTaskData.value, {
    onSuccess: () => {
      customToast.success(toast, ' Add task successfully')
      refetch()
      modalVisible.value = false
      newTaskData.value = structuredClone(initialNewTask.value)
      console.log(initialNewTask)
    }
  })
}
</script>
<template>
  <header class="flex py-4 shadow fixed w-full z-10 bg-white">
    <h1 class="w-1/6 items-center pl-6 text-4xl font-bold text-green-600">Kanban</h1>
    <div class="w-5/6 px-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-slate-800">Platform Launch</h1>
      <Button label="+ Add New Task" rounded size="small" @click="modalVisible = !modalVisible" />
    </div>
  </header>
  <Dialog
    v-model:visible="modalVisible"
    modal
    header="Adding task"
    @after-hide="() => (newTaskData = cloneDeep(initialNewTask) as CreateTaskBody)"
    :style="{ width: '32rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '100vw' }"
    :close-on-escape="true"
    :draggable="false"
  >
    <form class="w-full px-3" @submit.prevent="taskEditSubmit">
      <div class="mb-4">
        <p class="text-gray-500 font-semibold mb-2 text-sm">Task name</p>
        <InputText
          v-model="newTaskData.title"
          type="text"
          size="small"
          placeholder="e.g: Vue Route"
          class="w-full"
          @keydown.enter.prevent
        />
      </div>
      <div class="mb-4">
        <p class="text-gray-500 font-semibold mb-2 text-sm">Description</p>
        <Textarea v-model="newTaskData.description" autoResize rows="5" class="w-full text-sm" />
      </div>
      <div class="mb-4">
        <p class="text-gray-500 font-semibold mb-1 text-sm">Subtasks</p>
        <div
          class="flex gap-3 mb-2"
          v-for="(subtask, index) in newTaskData.subtasks"
          :key="subtask.id"
        >
          <InputText
            v-model="subtask.title"
            type="text"
            size="small"
            placeholder="Subtask title"
            class="w-full"
            @keydown.enter.prevent
          />
          <button
            class="text-gray-500 flex items-center cursor-pointer"
            @click.prevent="newTaskData.subtasks?.splice(index, 1)"
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
          label="Add subtask"
          outlined
          rounded
          size="small"
          @click.prevent="
            newTaskData.subtasks?.push({
              id: newTaskData.subtasks?.length + 1 || 0 + 1,
              done: false,
              title: ''
            })
          "
        />
      </div>
      <div class="mb-6">
        <p class="text-gray-500 font-semibold mb-1 text-sm">Current status</p>
        <Dropdown
          v-model="newTaskData.sort_key"
          :options="colList"
          option-label="col_name"
          option-value="col_id"
          class="w-full"
        />
      </div>
      <div class="flex gap-3">
        <Button type="submit" class="w-full" label="Submit" rounded size="small" />
      </div>
    </form>
  </Dialog>
</template>
