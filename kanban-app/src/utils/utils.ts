import type { BoardType } from '../types'
import type { TaskType } from 'src/types/board'
import type { UpdateTaskBody } from './../types/api.type'

const getColNames = (board: BoardType) => {
  const colNames: string[] = []
  if (!board) return ['']
  for (const column of board.data) {
    colNames.push(column.col_name)
  }

  return colNames
}

const getDataFromLS = (key: string) => {
  try {
    // Get the JSON string from localStorage
    const jsonString = localStorage.getItem(key)

    if (!jsonString) return
    // Parse the JSON string into an object
    const parsedObject = JSON.parse(jsonString)

    return parsedObject
  } catch (error) {
    // Handle any errors that might occur during parsing
    console.error('Error retrieving object from localStorage:', error)
    return null
  }
}

function filterTaskDataForUpdate(task: TaskType, board_id: string): UpdateTaskBody {
  return {
    ...task,
    board_id: board_id,
    sort_key: task.task_id,
    subtasks: task.subtasks?.map((subtask) => ({
      ...subtask,
      done: subtask.done ? 'True' : 'False'
    }))
  }
}

export { getColNames, getDataFromLS, filterTaskDataForUpdate }
