<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import type ContextMenu from 'primevue/contextmenu'
import { useToast } from 'primevue/usetoast'
import boardApis from 'src/apis/boards.api'
import { customToast } from 'src/utils/toast'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { CreateBoardBody } from 'src/types/api.type'
import { usePreviewBoardsQuery } from 'src/utils/queries'

const toast = useToast()
const modalVisible = ref(false)
const currentBoardId = ref('')

const { data: previewAllBoards, refetch } = usePreviewBoardsQuery()

const initialNewBoard = {
  board_name: '',
  columns_list: ['Todo', 'Doing', 'Done']
}

const newBoardData = ref<CreateBoardBody>(structuredClone(initialNewBoard))

// Context Menu
const boardCtxMenuRef = ref<InstanceType<typeof ContextMenu>>()
const showCtxMenu = (event: MouseEvent, board_id: string) => {
  boardCtxMenuRef.value?.show(event)
  currentBoardId.value = board_id
}

const boardCtxMenuList = ref([
  {
    label: 'Delete'
  }
])

// Declare mutation
const createBoardMutation = useMutation({
  mutationFn: boardApis.createNewBoard
})

const deleteBoardMutation = useMutation({
  mutationFn: boardApis.deleteBoard
})

// Handle Submit
const newBoardSubmit = () => {
  if (!newBoardData.value.board_name) {
    customToast.warning(toast, 'Board name cannot be empty')
    return
  }

  if (newBoardData.value.columns_list?.some((col) => !col)) {
    customToast.warning(toast, 'Column name cannot be empty')
    return
  }

  createBoardMutation.mutate(newBoardData.value, {
    onSuccess: () => {
      console.log(newBoardData)
      customToast.success(toast, 'Adding board successfully')
      newBoardData.value = structuredClone(initialNewBoard)
      refetch()
    }
  })

  modalVisible.value = false
}

const boardDelete = () => {
  if (confirm('You want delete this board?')) {
    deleteBoardMutation.mutate(currentBoardId.value, {
      onSuccess: () => {
        console.log(currentBoardId.value)
        customToast.success(toast, 'Delete board successfully')
        refetch()
      }
    })
  }
}

// Watchers
watch(modalVisible, (newValue, oldValue) => {
  if (oldValue) newBoardData.value = structuredClone(initialNewBoard)
})
</script>

<template>
  <div class="h-screen bg-white py-8 pr-6 pt-[108px]">
    <div v-if="previewAllBoards">
      <h1 class="pl-6 text-sm pb-4 tracking-widest uppercase text-gray-400 font-semibold">
        all boards ({{ previewAllBoards.length }})
      </h1>
      <div>
        <div>
          <RouterLink
            v-for="board in previewAllBoards"
            :key="board.board_id"
            :to="board.board_id"
            @contextmenu="showCtxMenu($event, board.board_id)"
            active-class="bg-green-600 text-white hover:bg-green-100 hover:text-green-600"
            class="block pl-6 py-4 my-2 list-none hover:bg-green-100 cursor-pointer duration-300 ease-in-out rounded-r-full text-gray-500 font-semibold"
          >
            <p>
              {{ board.board_name }}
            </p>
          </RouterLink>
          <ContextMenu ref="boardCtxMenuRef" :model="boardCtxMenuList">
            <template #item="{ item }">
              <button
                class="px-3 py-2 w-full text-left hover:bg-green-50 duration-200 bg-white"
                @click="boardDelete"
              >
                {{ item.label }}
              </button>
            </template>
          </ContextMenu>
        </div>
        <button
          @click="modalVisible = true"
          class="w-full text-left block pl-6 py-4 my-2 list-none bg-green-50 hover:bg-green-100 cursor-pointer duration-300 ease-in-out rounded-r-full text-green-600/80 font-bold"
        >
          + Add new board
        </button>
      </div>
    </div>
    <Dialog
      v-model:visible="modalVisible"
      modal
      header="Add new board"
      :style="{ width: '32rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      :close-on-escape="true"
      :draggable="false"
    >
      <form class="px-3" @submit.prevent="newBoardSubmit">
        <div class="mb-4">
          <h3 class="text-gray-500 font-semibold mb-2 text-sm">Board name</h3>
          <InputText
            v-model="newBoardData.board_name"
            type="text"
            size="small"
            placeholder="e.g: Nuxt Project"
            class="w-full"
            @keydown.enter.prevent
          />
        </div>
        <div class="mb-4">
          <p class="text-gray-500 font-semibold mb-1 text-sm">Columns</p>
          <div class="flex gap-3 mb-2" v-for="(_, index) in newBoardData.columns_list" :key="index">
            <InputText
              v-model="(newBoardData.columns_list as string[])[index]"
              type="text"
              size="small"
              placeholder="Column name"
              class="w-full"
              @keydown.enter.prevent
            />
            <button
              class="text-gray-500 flex items-center cursor-pointer"
              @click.prevent="(newBoardData.columns_list as string[])?.splice(index, 1)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Button
            class="mt-2 w-full"
            type="button"
            label="Add new column"
            outlined
            rounded
            size="small"
            @click.prevent="(newBoardData.columns_list as string[]).push('')"
          />
        </div>
        <Button class="mt-2 w-full" type="submit" label="Save changes" rounded size="small" />
      </form>
    </Dialog>
  </div>
</template>
