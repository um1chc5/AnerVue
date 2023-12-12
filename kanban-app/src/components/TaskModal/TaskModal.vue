<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import Checkbox from 'primevue/checkbox'
import { useToast } from 'primevue/usetoast'
import _ from 'lodash'
import useBoardsStore from 'src/stores/boards'
import { getColNames } from 'src/utils/utils'
import type { TaskType, BoardType } from 'src/types'

interface Props {
  modalTaskData: TaskType
  modalVisible?: boolean
  filteredBoard: BoardType
}

const store = useBoardsStore()
const { handleColChange, modalDataMarker } = store

const emit = defineEmits(['update:modalVisible'])

// Ref các thứ
const props = defineProps<Props>()

const modalTaskData = computed(() => props.modalTaskData)
const editableTaskData = ref(JSON.parse(JSON.stringify(modalTaskData.value)) as TaskType)
const localVisible = ref(props.modalVisible)
const localColName = ref(modalDataMarker.col_name)
const isEditable = ref(false)
const subtaskLength = computed(() => editableTaskData.value.subtasks?.length)

// Watcher các thứ
watch(modalTaskData, () => {
  editableTaskData.value = JSON.parse(JSON.stringify(modalTaskData.value))
})

watchEffect(() => {
  localVisible.value = props.modalVisible
  localColName.value = modalDataMarker.col_name
})

watch(localVisible, () => {
  emit('update:modalVisible', localVisible.value)
  console.log(localVisible.value)
  isEditable.value = false
  if (localColName.value !== modalDataMarker.col_name) {
    // console.log('localVisible change')
    handleColChange(
      props.filteredBoard.board_name,
      modalDataMarker.taskId,
      modalDataMarker.col_name,
      localColName.value
    )
  }
})

// Handle sự kiện
const subtaskFilledCheck = () => {
  return !editableTaskData.value.subtasks?.some((subtask) => subtask.title == '')
}

const toast = useToast()

const taskEditSubmit = () => {
  // console.log(editableTaskData.value.subtasks, modalTaskData.value.subtasks)

  const isFullFilled = subtaskFilledCheck()
  if (!isFullFilled) {
    console.log('hehe')
    toast.add({
      severity: 'warn',
      summary: 'Warn Message',
      detail: 'Subtask title cannot be empty',
      life: 3000
    })
  } else if (JSON.stringify(editableTaskData.value) !== JSON.stringify(modalTaskData.value)) {
    console.log('hehe')
    editableTaskData.value.subtasks?.forEach((subtask, index) => (subtask.id = index + 1))
    _.assign(modalTaskData.value, { ...JSON.parse(JSON.stringify(editableTaskData.value)) })
    localVisible.value = false
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Edit task successfully',
      life: 3000
    })
  }
}
</script>

<template>
  <Toast position="bottom-right" />
  <Dialog
    v-model:visible="localVisible"
    modal
    :header="modalDataMarker.task_title"
    :style="{ width: '32rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :close-on-escape="true"
    :draggable="false"
  >
    <div v-if="!isEditable">
      <p v-if="modalTaskData.description" class="pb-4 text-gray-400 text-sm">
        {{ modalTaskData.description }}
      </p>
      <p class="font-semibold text-gray-400 tracking-widest">
        subtasks ({{ modalTaskData.subtasks?.filter((subtask) => subtask.done).length }} of
        {{ modalTaskData.subtasks?.length }})
      </p>
      <div class="py-3 px-3">
        <li
          v-for="(subtask, index) in modalTaskData.subtasks"
          :key="index"
          class="cursor-pointer list-none flex items-center px-4 my-2 rounded bg-slate-50 hover:bg-green-100 duration-100"
        >
          <Checkbox v-model="subtask.done" :binary="true" :input-id="String(subtask.id)" />
          <label
            :class="[
              subtask.done
                ? 'text-gray-400 line-through font-semibold text-sm cursor-pointer grow pl-3 py-4'
                : 'text-slate-900 font-semibold text-sm cursor-pointer grow pl-3 py-4'
            ]"
            :for="String(subtask.id)"
            >{{ subtask.title }}</label
          >
        </li>
      </div>
      <div class="px-3">
        <p class="text-gray-500 font-semibold mb-1 text-sm">Current status</p>
        <Dropdown v-model="localColName" :options="getColNames(filteredBoard)" class="w-full" />
      </div>
      <div class="w-full pt-4 px-3">
        <Button
          class="block w-full"
          label="Edit Task"
          rounded
          size="small"
          @click="isEditable = !isEditable"
        />
      </div>
    </div>
    <div v-else>
      <form class="w-full px-3" @submit.prevent="taskEditSubmit">
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-2 text-sm">Task name</p>
          <InputText
            v-model="editableTaskData.title"
            type="text"
            size="small"
            placeholder="Task title"
            class="w-full"
            @keydown.enter.prevent
          />
        </div>
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-2 text-sm">Description</p>
          <Textarea
            v-model="editableTaskData.description"
            autoResize
            rows="5"
            class="w-full text-sm"
          />
        </div>
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-1 text-sm">Subtasks</p>
          <div
            class="flex gap-3 mb-2"
            v-for="(subtask, index) in editableTaskData.subtasks"
            :key="index"
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
              @click.prevent="editableTaskData.subtasks?.splice(index, 1)"
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
              editableTaskData.subtasks?.push({
                id: subtaskLength || 0 + 1,
                done: false,
                title: ''
              })
            "
          />
        </div>
        <div class="mb-6">
          <p class="text-gray-500 font-semibold mb-1 text-sm">Current status</p>
          <Dropdown v-model="localColName" :options="getColNames(filteredBoard)" class="w-full" />
        </div>
        <div class="flex gap-3">
          <Button type="submit" class="w-full" label="Submit" rounded size="small" />
          <Button
            class="w-full"
            severity="secondary"
            outlined
            label="Back"
            rounded
            size="small"
            @click="
              () => {
                isEditable = !isEditable
                editableTaskData = JSON.parse(JSON.stringify(modalTaskData))
              }
            "
          />
        </div>
      </form>
    </div>
  </Dialog>
</template>
