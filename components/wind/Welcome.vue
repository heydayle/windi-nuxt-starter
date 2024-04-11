<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

const localPath = useLocalePath()
const { winduxt } = useAppConfig()
const titles = computed(() => {
  const text = winduxt.page.welcome.title.split(' ')
  return [
    {
      title: text[0],
      bg: 'from-green-500 via-indigo-500 to-green-500',
    },
    {
      title: text[1],
      bg: 'from-green-500 via-indigo-500 to-green-500',
    },
    {
      title: text[2],
      bg: 'from-green-500 via-indigo-500 to-green-500',
    },
  ]
})
const activeTitle = ref(0)
useIntervalFn(() => {
  activeTitle.value = activeTitle.value < 2 ? (activeTitle.value += 1) : 0
}, 5000)
</script>
<template>
  <div class="flex flex-col justify-center items-center overflow-hidden py-4">
    <div
      v-for="(item, index) in titles"
      :key="index"
      :class="index === activeTitle ? item.bg : 'bg-gray-100'"
      class="text-9xl transition-opacity py-4 duration-500 font-semibold animate-text bg-gradient-to-r bg-clip-text text-transparent"
    >
      {{ item.title }}
    </div>
    <UButton :to="localPath('/install')">
      <UIcon name="material-symbols:play-arrow" class="text-xl" />
      Get started
    </UButton>
  </div>
</template>
