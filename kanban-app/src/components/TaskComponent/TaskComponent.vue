<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type ContextMenu from 'primevue/contextmenu'
import { useToast } from 'primevue/usetoast'
import useBoardsStore from 'src/stores/boards'
import type { TaskType } from 'src/types'
import { currentBoardQuery, useDeleteTaskMutation } from 'src/utils/queries'
import { getColIdFromTaskId } from 'src/utils/skUtils'
import { customToast } from 'src/utils/toast'
import { ref } from 'vue'

// TYPE, INTERFACE
interface Props {
  task: TaskType
  modalVisible: boolean
}

// GET DATA FROM STORE
const { current_board_id, modalTaskData } = storeToRefs(useBoardsStore())
const { data: currentBoardData, refetch } = currentBoardQuery(current_board_id)

// QUERY, MUTATION, API REQUEST
const deleteTaskMutation = useDeleteTaskMutation()

// DECLARE REFS, VARIABLES, UTILITIES
const props = defineProps<Props>()
const toast = useToast()
const emit = defineEmits(['update:modalVisible'])

// Mutation các thứ
const handleDeleteTask = (task_id: string) => {
  if (confirm('You want delete this task')) {
    deleteTaskMutation.mutate(
      { board_id: current_board_id.value, task_id: task_id },
      {
        onSuccess: () => {
          refetch()
          customToast.success(toast, 'Delete task successfully')
        }
      }
    )
  }
}

const ctxMenuRef = ref<InstanceType<typeof ContextMenu>>()
const showCtxMenu = (event: MouseEvent) => {
  ctxMenuRef.value?.show(event)
}

const ctxMenuList = ref([
  {
    label: 'Delete'
  }
])

// FUNCTION, METHODS
const handleOpenModal = (task_id: string) => {
  modalTaskData.value = currentBoardData.value?.data
    ?.find((col) => col.col_id === getColIdFromTaskId(task_id))
    ?.tasks.find((task) => task.task_id === task_id)
  emit('update:modalVisible', !props.modalVisible)
}

//
</script>
<template>
  <div class="cursor-pointer">
    <li
      class="px-4 py-6 bg-white shadow-md rounded-lg my-3 list-none group"
      @click="handleOpenModal(props.task.task_id)"
      @contextmenu="showCtxMenu"
    >
      <p class="text-slate-900 font-semibold group-hover:text-green-600 duration-200 mb-2">
        {{ props.task.title }}
      </p>
      <p class="text-xs font-semibold text-gray-400">
        {{ props.task.subtasks?.filter((subtask) => subtask.done).length }} of
        {{ props.task.subtasks?.length }} subtasks
      </p>
    </li>
    <ContextMenu ref="ctxMenuRef" :model="ctxMenuList">
      <template #item="{ item }">
        <button
          class="px-3 py-2 w-full text-left hover:bg-green-50 duration-200 bg-white"
          @click="handleDeleteTask(task.task_id)"
        >
          {{ item.label }}
        </button>
      </template>
    </ContextMenu>
  </div>
</template>
