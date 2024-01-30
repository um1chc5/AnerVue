export interface BoardType {
  board_id?: string
  board_name: string
  data: {
    col_id?: string
    col_name: string
    tasks: TaskType[]
  }[]
}

export interface TaskType {
  task_id: string
  title: string
  description?: string
  subtasks?: Subtask[]
}

export interface Subtask {
  id: number
  title: string
  done: boolean | string
}

export type TaskModalMarkerType = {
  col_id: string
  task_id: string
  col_name: string
}
