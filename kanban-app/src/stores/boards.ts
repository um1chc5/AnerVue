import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { BoardType, TaskModalMarkerType, TaskType } from '../types'

const useBoardsStore = defineStore('counter', () => {
  const boards = reactive<BoardType[]>([
    {
      board_name: 'Vue learning plan',
      path: 'vue-learning-plan',
      data: [
        {
          col_name: 'Todo',
          tasks: [
            {
              id: 1,
              title: 'Build UI for onboarding flow',
              description:
                ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
              subtasks: [
                { id: 1, title: 'subtask 1', done: false },
                { id: 2, title: 'subtask 2', done: true },
                { id: 3, title: 'subtask 3', done: false }
              ]
            },
            {
              id: 2,
              title: 'yeah',
              subtasks: [
                { id: 1, title: 'subtask 1', done: false },
                { id: 2, title: 'subtask 2', done: true },
                { id: 3, title: 'subtask 3', done: false }
              ]
            }
          ]
        },
        {
          col_name: 'Doing',
          tasks: [
            {
              id: 1,
              title: 'go',
              subtasks: [
                { id: 1, title: 'subtask 1', done: true },
                { id: 2, title: 'subtask 2', done: false }
              ]
            },
            {
              id: 2,
              title: 'go',
              subtasks: [
                { id: 1, title: 'subtask 1', done: false },
                { id: 2, title: 'subtask 2', done: true },
                { id: 3, title: 'subtask 3', done: false }
              ]
            }
          ]
        },
        {
          col_name: 'Done',
          tasks: [
            {
              id: 1,
              title: 'yeah',
              subtasks: [
                { id: 1, title: 'subtask 1', done: false },
                { id: 2, title: 'subtask 2', done: true }
              ]
            },
            {
              id: 2,
              title: 'yeah',
              subtasks: [
                { id: 1, title: 'subtask 1', done: false },
                { id: 2, title: 'subtask 2', done: true }
              ]
            }
          ]
        }
      ]
    },
    {
      board_name: 'Fsoft intern plan',
      path: 'fsoft-intern-plan',
      data: [
        { col_name: 'Todo', tasks: [] },
        { col_name: 'Doing', tasks: [] },
        { col_name: 'Done', tasks: [] }
      ]
    }
  ])

  const modalDataMarker = ref<TaskModalMarkerType>({
    board_name: '',
    task_title: '',
    col_name: '',
    taskId: 1
  })

  const handleDeleteTask = (board_name: string, col_name: string, index: number) => {
    const currBoard = boards.find((board) => board.board_name === board_name)
    currBoard.data.find((colData) => colData.col_name === col_name).tasks.splice(index, 1)
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
