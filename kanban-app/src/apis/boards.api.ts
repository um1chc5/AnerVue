import type {
  CreateBoardBody,
  CreateTaskBody,
  PreviewBoard,
  UpdateTaskBody
} from 'src/types/api.type'
import http from './http'
import type { SuccessResponse } from 'src/types/response.type'
import type { BoardType } from './../types/board'
import type { UpdateBoardBody } from './../types/api.type'

/**
- sort_key trong các params có thể là col_id, task_id
*/

class BoardApis {
  getPreviewBoardsInfo() {
    return http.get<SuccessResponse<PreviewBoard[]>>('boards_data')
  }

  getBoardById(board_id: string) {
    return http.get<SuccessResponse<BoardType>>('get_board', {
      params: {
        board_id: board_id
      }
    })
  }

  createNewBoard(request_body: CreateBoardBody) {
    return http.post('create', {
      create_type: 'create_board',
      ...request_body
    })
  }

  createNewTask(request_body: CreateTaskBody) {
    return http.post('create', {
      create_type: 'create_task',
      ...request_body
    })
  }

  updateTask(request_body: UpdateTaskBody) {
    return http.put('update', {
      update_type: 'update_task',
      ...request_body
    })
  }

  updateBoard(request_body: UpdateBoardBody) {
    return http.put('update', {
      update_type: 'update_board',
      ...request_body
    })
  }

  deleteBoard(board_id: string) {
    return http.delete('delete', {
      data: {
        delete_type: 'delete_board',
        board_id: board_id
      }
    })
  }

  deleteTask(board_id: string, task_id: string) {
    return http.delete('delete', {
      data: {
        delete_type: 'delete_task',
        board_id: board_id,
        sort_key: task_id
      }
    })
  }
}

const boardApis = new BoardApis()

export default boardApis
