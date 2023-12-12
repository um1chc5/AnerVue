import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { BoardType } from '../types'

const getColNames = (board: BoardType) => {
  const colNames: string[] = []
  if (!board) return ['']
  for (const column of board.data) {
    colNames.push(column.col_name)
  }

  return colNames
}

const boardFiltering = (boardsInput: BoardType[], route: RouteLocationNormalizedLoaded) => {
  const result = boardsInput.filter((board) => board.path === route.params.plan)[0]
  return result
}

export { getColNames, boardFiltering }
