import { useQuery, useMutation } from '@tanstack/vue-query'
import boardApis from 'src/apis/boards.api'
import { computed, type Ref } from 'vue'

export const usePreviewBoardsQuery = () =>
  useQuery({
    queryKey: ['preview_boards'],
    queryFn: boardApis.getPreviewBoardsInfo,
    select: (res) => res.data.body,
    staleTime: 300000
  })

export const useCurrentBoardQuery = (current_board_id: Ref<string>) =>
  useQuery({
    queryKey: ['current_board', current_board_id],
    queryFn: () => boardApis.getBoardById(current_board_id.value),
    select: (res) => ({
      ...res.data.body,
      data: res.data.body.data.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => ({
          ...task,
          subtasks: task.subtasks.map((subtask) => ({
            ...subtask,
            done: subtask.done === 'True'
          }))
        }))
      }))
    }),
    staleTime: 300000,
    enabled: computed(() => Boolean(current_board_id.value))
  })

export const useCreateTaskMutation = () =>
  useMutation({
    mutationFn: boardApis.createNewTask
  })

export const useDeleteTaskMutation = () =>
  useMutation({
    mutationFn: ({ board_id, task_id }: { board_id: string; task_id: string }) =>
      boardApis.deleteTask(board_id, task_id)
  })
