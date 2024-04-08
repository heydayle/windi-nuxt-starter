<script setup lang="ts">
useSeoMeta({
  title: 'Moving editor',
})
</script>
<template>
  <div>
    <WindEditor
      v-bind="{
        x: 40,
        y: 40,
        content: '<p>Hello</p>',
      }"
    />
    <WindEditor
      v-bind="{
        x: 300,
        y: 40,
        content: '<p>I\'m Nuxt</p>',
      }"
    />
  </div>
</template>
