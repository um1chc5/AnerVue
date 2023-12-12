export interface BoardType {
  board_name: string
  path: string
  data: {
    col_name: string
    tasks: TaskType[]
  }[]
}

export interface TaskType {
  id: number
  title: string
  description?: string
  subtasks?: {
    id: number
    title: string
    done: boolean
  }[]
}

export type TaskModalMarkerType = {
  board_name: string
  task_title: string
  col_name: string
  taskId: number
}
