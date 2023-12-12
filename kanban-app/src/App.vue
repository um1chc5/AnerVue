<template>
  <div class="h-full">
    <HeaderComponent />
    <div class="flex">
      <div class="w-1/6">
        <SideBar />
      </div>
      <div>
        <BoardComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardComponent from './components/BoardComponent/BoardComponent.vue'
import HeaderComponent from './components/Header'
import SideBar from './components/SideBar/SideBar.vue'
</script>
