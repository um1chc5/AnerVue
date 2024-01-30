<template>
  <div class="h-full">
    <HeaderComponent />
    <div class="fixed w-[260px]">
      <SideBar />
    </div>
    <div>
      <BoardComponent />
    </div>
    <VueQueryDevtools />
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import BoardComponent from './components/BoardComponent/BoardComponent.vue'
import HeaderComponent from './components/Header'
import SideBar from './components/SideBar/SideBar.vue'
</script>
