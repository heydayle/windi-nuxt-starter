<script setup lang="ts">
import { get, set } from '@vueuse/core'
useSeoMeta({
  title: 'Moving editor',
})
interface IEditor {
  x: number
  y: number
  content: string
}
const editorList = ref<IEditor[]>([
  {
    x: 40,
    y: 150,
    content: '<p>Hello</p>',
  },
  {
    x: 300,
    y: 150,
    content: '<p>I\'m Nuxt</p>',
  },
])
const getRandomInt = (max: number = 1) => {
  return Math.floor(Math.random() * max)
}
const createEditor = () => {
  const position = {
    x: getRandomInt(window.innerWidth - 100),
    y: getRandomInt(window.innerHeight - 40),
  }
  const newE = {
    ...position,
    content: 'x: ' + position.x + ', y: ' + position.y,
  }
  get(editorList).push(newE)
}
</script>
<template>
  <div>
    <UButton @click="createEditor">
      <Icon name="mdi:plus" />
    </UButton>
    <WindEditor
      v-for="(editor, index) in editorList"
      :key="index"
      v-bind="{
        ...editor,
      }"
    />
  </div>
</template>
