<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { winduxt } = useAppConfig()
</script>
<template>
  <div class="mx-auto text-center">
    <UButton target="_blank" :to="winduxt?.project?.github"> Install </UButton>
  </div>
</template>
