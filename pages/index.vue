<script setup lang="ts">
const { winduxt } = useAppConfig()
definePageMeta({ layout: 'default' })
useHead({
  title: winduxt?.host,
})
</script>
<template>
  <WindWelcome />
</template>
