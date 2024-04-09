<script setup lang="ts">
import { get, set, useActiveElement } from '@vueuse/core'
import { UseMouseInElement, UseActiveElement } from '@vueuse/components'
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
    x: 800,
    y: 150,
    content: '<p>Hello</p>',
  },
  {
    x: 400,
    y: 150,
    content: '<p>I\'m Nuxt</p>',
  },
])
const getRandomInt = (max: number = 1) => {
  return Math.floor(Math.random() * max)
}
const createEditor = () => {
  const position = {
    x: getRandomInt(window.innerWidth - 600),
    y: getRandomInt(window.innerHeight - 70),
  }
  const newE = {
    ...position,
    content: 'x: ' + position.x + ', y: ' + position.y,
  }
  get(editorList).push(newE)
}
</script>
<template>
  <div class="h-screen overflow-hidden">
    <UButton @click="createEditor">
      <Icon name="mdi:plus" />
    </UButton>
    <UseMouseInElement
      v-slot="{ elementX, elementY, isOutside }"
      class="h-screen relative"
    >
      {{ elementX }}
      {{ elementY }}
      {{ isOutside }}
      <WindEditor
        v-for="(editor, index) in editorList"
        :key="index"
        :data-id="index"
        v-bind="{
          ...editor,
        }"
      />
    </UseMouseInElement>
  </div>
</template>
