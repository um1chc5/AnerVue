<script setup lang="ts">
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { computed, ref, watchEffect } from 'vue'
import useBoardsStore from 'src/stores/boards'
import TaskModal from '../TaskModal'
import type { BoardType, TaskType } from 'src/types'
import TaskComponent from '../TaskComponent'
import { boardFiltering } from 'src/utils/utils'

const store = useBoardsStore()
const route = useRoute()
const { boards, modalDataMarker } = store
const modalVisible = ref(false)
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

const handleOpenModal = (board_name: string, col_name: string, title: string, id: number) => {
  modalDataMarker.board_name = board_name
  modalDataMarker.col_name = col_name
  modalDataMarker.task_title = title
  modalDataMarker.taskId = id
  modalVisible.value = !modalVisible.value
}

const filteredBoard = computed(() => boardFiltering(boards, route))
const modalTaskData = computed(() => {
  const data = boards
    .find((board) => board.board_name === modalDataMarker.board_name)
    ?.data.find((col) => col.col_name === modalDataMarker.col_name)
    ?.tasks.find((task) => task.id === modalDataMarker.taskId)
  return data as TaskType
})
</script>

<template>
  <div class="bg-slate-100 h-screen absolute top-0 w-5/6 z-0 pt-[108px] px-6 flex gap-6">
    <div v-for="(board, index) in filteredBoard?.data" :key="index" class="flex flex-col">
      <p class="text-sm text-gray-400 font-semibold tracking-widest w-[280px]">
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
    <TaskModal
      :modal-visible="modalVisible"
      :modal-task-data="modalTaskData || ({} as TaskType)"
      @update:modal-visible="(msg) => (modalVisible = msg)"
      :filtered-board="filteredBoard || ({} as BoardType)"
    />
  </div>
</template>
