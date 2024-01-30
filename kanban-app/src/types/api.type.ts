import type { Subtask } from './board'

export interface CreateBoardBody {
  board_name: string
  columns_list?: string[]
}

export interface CreateTaskBody {
  sort_key: string
  board_id: string
  description?: string
  title: string
  subtasks?: Subtask[]
}

export interface UpdateColBody {
  board_id: string
  sort_key: string
  col_name: string
}

export interface UpdateTaskBody {
  board_id: string
  sort_key: string
  title?: string
  description?: string
  subtasks?: Subtask[]
}

export interface UpdateBoardBody {
  board_id: string
  board_name: string
  new_records?: string[]
  name_changing_records?: NameChangingRecord[]
  delete_records?: string[]
}

export interface NameChangingRecord {
  sort_key: string
  col_name: string
}

export interface PreviewBoard {
  sk: string
  board_id: string
  board_name: string
  created_time: string
}
