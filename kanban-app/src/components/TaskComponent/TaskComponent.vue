<script setup lang="ts">
import type ContextMenu from 'primevue/contextmenu'
import useBoardsStore from 'src/stores/boards'
import type { BoardType, TaskType } from 'src/types'
import { ref, type VNodeRef } from 'vue'

interface Props {
  handleOpenModal: (board_name: string, col_name: string, title: string, id: number) => void
  task: TaskType
  filteredBoard: BoardType
  board: {
    col_name: string
    tasks: TaskType[]
  }
}
defineProps<Props>()

const { handleDeleteTask } = useBoardsStore()
const ctxMenuRef = ref<InstanceType<typeof ContextMenu>>()
const showCtxMenu = (event: MouseEvent) => {
  ctxMenuRef.value?.show(event)
}

const ctxMenuList = ref([
  {
    label: 'Delete'
  }
])

//
</script>
<template>
  <div>
    <li
      class="px-4 py-4 w-[280px] bg-white shadow-md rounded-lg my-3 list-none group"
      @click="handleOpenModal(filteredBoard?.board_name, board.col_name, task.title, task.id)"
      @contextmenu="showCtxMenu"
    >
      <p class="text-slate-900 font-semibold group-hover:text-green-600 duration-200">
        {{ task.title }}
      </p>
      <p class="text-xs font-semibold text-gray-400">
        {{ (task as TaskType).subtasks?.filter((subtask) => subtask.done).length }} of
        {{ (task as TaskType).subtasks?.length }} subtasks
      </p>
    </li>
    <ContextMenu ref="ctxMenuRef" :model="ctxMenuList">
      <template #item="{ item }">
        <button
          class="px-3 py-2 w-full text-left hover:bg-green-50 duration-200 bg-white"
          @click="handleDeleteTask(filteredBoard.board_name, board.col_name, task.id - 1)"
        >
          {{ item.label }}
        </button>
      </template>
    </ContextMenu>
  </div>
</template>
