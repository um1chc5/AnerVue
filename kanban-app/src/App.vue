<template>
  <div class="h-full">
    <HeaderComponent />
    <div class="fixed w-[260px]">
      <SideBar />
    </div>
    <div>
      <BoardComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardComponent from './components/BoardComponent/BoardComponent.vue'
import HeaderComponent from './components/Header'
import SideBar from './components/SideBar/SideBar.vue'
</script>
