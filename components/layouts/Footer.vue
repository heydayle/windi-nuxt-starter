<script setup lang="ts">
const { winduxt } = useAppConfig()
</script>
<template>
  <div class="fixed bottom-0 w-full">
    <div
      class="w-full max-w-screen-xl mx-auto text-xs text-center text-gray-400"
    >
      <div>
        Copyright ©
        {{ winduxt?.layout?.footer?.year || new Date().getFullYear() }}
        {{ winduxt?.author?.name || '' }}. All rights reserved.
      </div>
      <div>{{ winduxt.name }}</div>
    </div>
  </div>
</template>
