<script setup lang="ts">
useSeoMeta({
  title: 'Moving editor',
})
definePageMeta({ layout: 'area' })
</script>
<template>
  <div class="grid grid-cols-[1fr,300px]">
    <WindArea />
    <div
      id="area-text-list"
      class="h-screen overflow-auto px-4 pb-[120px]"
    ></div>
  </div>
</template>
