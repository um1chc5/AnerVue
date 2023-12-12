<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useBoardsStore from 'src/stores/boards'
import { RouterLink } from 'vue-router'

const store = useBoardsStore()
const { boards } = storeToRefs(store)
</script>

<template>
  <div class="py-8 pr-6">
    <h1 class="pl-6 text-sm pb-6 tracking-widest uppercase text-gray-400 font-semibold">
      all boards ({{ boards.length }})
    </h1>
    <div>
      <RouterLink
        v-for="(board, index) in boards"
        :key="index"
        :to="board.path"
        active-class="bg-green-600 text-white hover:bg-green-100 hover:text-green-600"
        class="block pl-6 py-4 my-2 list-none hover:bg-green-100 cursor-pointer duration-300 ease-in-out rounded-r-full text-gray-500 font-semibold"
      >
        {{ board.board_name }}
      </RouterLink>
    </div>
  </div>
</template>
