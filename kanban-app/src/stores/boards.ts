import { reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { BoardType, TaskModalMarkerType, TaskType } from '../types'
import { getDataFromLS } from 'src/utils/utils'
import { initalBoards } from './initalBoards'

const useBoardsStore = defineStore('counter', () => {
  const boardsData = getDataFromLS('kanban-boards') ? getDataFromLS('kanban-boards') : initalBoards

  const boards = reactive<BoardType[]>(boardsData)

  watch(boards, () => {
    localStorage.setItem('kanban-boards', JSON.stringify(boards))
  })

  const modalDataMarker = ref<TaskModalMarkerType>({
    board_name: '',
    task_title: '',
    col_name: '',
    taskId: 1
  })

  const handleDeleteTask = (board_name: string, col_name: string, index: number) => {
    if (boards) {
      const currBoard = boards?.find((board) => board.board_name === board_name)
      if (currBoard) {
        const colData = currBoard.data.find((colData) => colData.col_name === col_name)
        if (colData) colData.tasks.splice(index, 1)
      }
    }
  }

  const handleColChange = (boardName: string, taskId: number, oldCol: string, newCol: string) => {
    const boardIndex = boards.findIndex((board) => board.board_name === boardName)

    if (boardIndex !== -1) {
      const board = boards[boardIndex]
      const oldColIndex = board.data.findIndex((col) => col.col_name === oldCol)
      const newColIndex = board.data.findIndex((col) => col.col_name === newCol)

      if (oldColIndex !== -1 && newColIndex !== -1) {
        const taskIndex = board.data[oldColIndex].tasks.findIndex((task) => task.id === taskId)

        if (taskIndex !== -1) {
          const movedTask: TaskType = {
            ...board.data[oldColIndex].tasks[taskIndex],
            id: board.data[newColIndex].tasks.length + 1
          }
          board.data[newColIndex].tasks.push(movedTask)
          board.data[oldColIndex].tasks.splice(taskIndex, 1)
        }
      }
    }
  }

  return { boards, handleColChange, modalDataMarker, handleDeleteTask }
})

export default useBoardsStore
