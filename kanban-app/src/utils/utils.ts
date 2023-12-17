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

const getDataFromLS = (key: string) => {
  try {
    // Get the JSON string from localStorage
    const jsonString = localStorage.getItem(key)

    // Parse the JSON string into an object
    const parsedObject = JSON.parse(jsonString)

    return parsedObject
  } catch (error) {
    // Handle any errors that might occur during parsing
    console.error('Error retrieving object from localStorage:', error)
    return null
  }
}

export { getColNames, boardFiltering, getDataFromLS }
