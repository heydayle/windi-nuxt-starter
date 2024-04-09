<script setup lang="ts">
import { get } from '@vueuse/core'
useSeoMeta({
  title: 'Moving editor',
})
interface IEditor {
  x: number
  y: number
  content: string
}
const dynamicRef = ref([])
const editorRef = ref(null)
const editorArea = ref(null)
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
const activeId = ref<string | number>('')
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
watch(activeId, (value) => {
  console.log(value)
})
const onClickOutside = () => {
  console.log(dynamicRef.value[1])
  dynamicRef.value.forEach(e => e?.onClickOutside())
}
</script>
<template>
  <div
    class="h-screen max-w-screen-2xl overflow-hidden"
    @click="onClickOutside"
  >
    <UButton @click="createEditor">
      <Icon name="mdi:plus" />
    </UButton>
    <WindEditor
      v-for="(editor, index) in editorList"
      :ref="
        (el: HTMLElement) => {
          dynamicRef[index] = el
        }
      "
      :key="index"
      v-model:activeId="activeId"
      v-bind="{
        ...editor,
        id: index,
      }"
      @click-outside="onClickOutside"
    />
  </div>
</template>
