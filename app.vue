<script setup lang="ts">
import thumbnail from '/public/thumbnail.png'
const { winduxt } = useAppConfig()
useSeoMeta({
  title: winduxt?.page?.welcome?.title,
  description: winduxt?.page?.welcome?.description,
  keywords: 'nuxt 3, vue 3, vuejs, template fe, framework for fe',
  ogImage: thumbnail,
  author: winduxt.author.name,
  publisher: winduxt.author.name,
})
</script>
<template>
  <div>
    <NuxtLayout />
  </div>
</template>
