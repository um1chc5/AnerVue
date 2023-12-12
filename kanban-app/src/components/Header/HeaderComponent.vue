<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import useBoardsStore from 'src/stores/boards'
import type { TaskType } from 'src/types'
import { boardFiltering, getColNames } from 'src/utils/utils'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'

type CustomTaskType = TaskType & {
  col_name: string
}
const store = useBoardsStore()
const { boards } = store
const route = useRoute()
const modalVisible = ref(false)

const currentBoard = computed(() => boardFiltering(boards, route))
const initialColName = computed(() => getColNames(currentBoard.value)[0])
const subtaskLength = computed(() => newTaskData.value.subtasks?.length)
const newTaskData = ref({
  title: '',
  description: '',
  subtasks: [{}],
  col_name: ''
} as CustomTaskType)

const toast = useToast()

watchEffect(() => {
  newTaskData.value.col_name = initialColName.value // Để gán lại value cho col_name
})

const taskEditSubmit = () => {
  if (newTaskData.value.title === '') {
    toast.add({
      detail: 'Task name cannot be empty',
      severity: 'warn',
      life: 3000,
      closable: true
    })
    return
  }

  if (newTaskData.value.subtasks && newTaskData.value.subtasks.some((subtask) => !subtask.title)) {
    toast.add({
      detail: 'Subtask title cannot be empty',
      severity: 'warn',
      life: 3000,
      closable: true
    })
    return
  }

  const targetColData = currentBoard.value.data.find(
    (col) => col.col_name === newTaskData.value.col_name
  )
  if (targetColData) {
    targetColData.tasks.push({
      id: targetColData.tasks.length + 1,
      title: newTaskData.value.title,
      description: newTaskData.value.description,
      subtasks: [..._.cloneDeep(newTaskData.value.subtasks)]
    })
    toast.add({
      detail: 'Add task succesfully',
      severity: 'success',
      life: 3000,
      closable: true
    })

    modalVisible.value = false
    newTaskData.value.subtasks = [{ done: false, id: 1, title: '' }]
  }
}

//
</script>
<template>
  <header class="flex py-4 shadow relative z-10 bg-white">
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
    :style="{ width: '32rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
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
        <div class="flex gap-3 mb-2" v-for="(subtask, index) in newTaskData.subtasks" :key="index">
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
              id: subtaskLength || 0 + 1,
              done: false,
              title: ''
            })
          "
        />
      </div>
      <div class="mb-6">
        <p class="text-gray-500 font-semibold mb-1 text-sm">Current status</p>
        <Dropdown
          v-model="newTaskData.col_name"
          :options="getColNames(currentBoard)"
          class="w-full"
        />
      </div>
      <div class="flex gap-3">
        <Button type="submit" class="w-full" label="Submit" rounded size="small" />
      </div>
    </form>
  </Dialog>
</template>
