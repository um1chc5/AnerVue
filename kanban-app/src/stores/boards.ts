import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TaskType } from 'src/types/board'

const useBoardsStore = defineStore('counter', () => {
  const current_board_id = ref('')
  const colList = ref<{ col_id: string; col_name: string }[]>()
  const modalTaskData = ref<TaskType>()

  return { current_board_id, modalTaskData, colList }
})

export default useBoardsStore
