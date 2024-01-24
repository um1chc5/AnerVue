<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import { useToast } from 'primevue/usetoast'
import { cloneDeep } from 'lodash'
import useBoardsStore from 'src/stores/boards'
import type { TaskType } from 'src/types'
import { customToast } from 'src/utils/toast'
import { storeToRefs } from 'pinia'
import { getColIdFromTaskId } from 'src/utils/skUtils'
import { useMutation } from '@tanstack/vue-query'
import boardApis from 'src/apis/boards.api'
import { filterTaskDataForUpdate } from 'src/utils/utils'
import { currentBoardQuery } from 'src/utils/queries'

interface Props {
  modalTaskData: TaskType
  modalVisible?: boolean
}

// GET DATA FROM STORE
const { colList, current_board_id } = storeToRefs(useBoardsStore())

// DECLARE REFS, VARIABLES, UTILITIES
const props = defineProps<Props>()
const editableTaskData = ref<TaskType>()
const currentColumnId = ref()
const localVisible = ref(props.modalVisible)
const isEditable = ref(false)
const isTaskChange = ref(false)
const subtaskLength = computed(() => editableTaskData.value.subtasks?.length)
const emit = defineEmits(['update:modalVisible'])
const toast = useToast()

// MUTATION, QUERY
const { mutate } = useMutation({
  mutationFn: boardApis.updateTask
})

const updateTaskMutate = () =>
  mutate(filterTaskDataForUpdate(editableTaskData.value, current_board_id.value), {
    onSuccess: () => {
      customToast.success(toast, 'Update task thành công!')
      currentBoardRefetch()
    }
  })

const { refetch: currentBoardRefetch } = currentBoardQuery(current_board_id)

// WATCHERS
watch(localVisible, () => {
  if (!localVisible.value) {
    emit('update:modalVisible', localVisible.value)
    if (isTaskChange.value && !isEditable.value) {
      console.log(isEditable.value)
      updateTaskMutate()
    }
  }
  isEditable.value = false
})

watch(props, () => {
  if (props.modalVisible) {
    currentColumnId.value = getColIdFromTaskId(props.modalTaskData.task_id)
    editableTaskData.value = cloneDeep(props.modalTaskData)
  }
  localVisible.value = props.modalVisible
})

watch(
  editableTaskData,
  (value) => {
    isTaskChange.value = JSON.stringify(value) !== JSON.stringify(props.modalTaskData)
  },
  { deep: true }
)

// HANDLE EVENT
const subtaskFilledCheck = () => {
  return !editableTaskData.value.subtasks?.some((subtask) => subtask.title == '')
}

const taskEditSubmit = () => {
  const isFullFilled = subtaskFilledCheck()
  if (!isFullFilled) {
    customToast.warning(toast, 'Subtask title cannot be empty')
  } else if (isTaskChange.value) {
    updateTaskMutate()
    localVisible.value = false
  } else {
    customToast.warning(
      toast,
      'Task content is not changing, press esc or close button to cancel popup'
    )
  }
}
</script>

<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    :header="modalTaskData.title"
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
          v-for="(subtask, index) in editableTaskData.subtasks"
          :key="index"
          class="cursor-pointer list-none flex items-center px-4 my-2 rounded bg-slate-50 hover:bg-green-100 duration-100"
        >
          <Checkbox v-model="subtask.done" :binary="true" :input-id="String(subtask.id)" />
          <label
            :class="[
              'text-sm cursor-pointer grow pl-3 py-4',
              subtask.done
                ? 'text-gray-400 line-through font-semibold '
                : 'text-slate-900 font-semibold '
            ]"
            :for="String(subtask.id)"
            >{{ subtask.title }}</label
          >
        </li>
      </div>
      <div class="px-3">
        <p class="text-gray-500 font-semibold mb-1 text-sm">Current status</p>
        <Dropdown
          v-model="currentColumnId"
          :options="colList"
          option-label="col_name"
          option-value="col_id"
          class="w-full"
        />
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
          <Dropdown
            v-model="currentColumnId"
            :options="colList"
            option-label="col_name"
            option-value="col_id"
            class="w-full"
          />
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
