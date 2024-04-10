<script setup lang="ts">
import { get, set, useElementSize } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
useSeoMeta({
  title: 'Moving editor',
})
definePageMeta({ layout: 'area' })
interface IEditor {
  id: string
  x: number
  y: number
  content: string
}
const dynamicRef = ref([])
const editorRef = ref(null)
const editorArea = ref(null)
const editorList = ref<IEditor[]>([
  {
    id: uuidv4(),
    x: 600,
    y: 150,
    content: '<p>Double click to edit</p>',
  },
  {
    id: uuidv4(),
    x: 670,
    y: 250,
    content: '<p>One click to resize</p>',
  },
  {
    id: uuidv4(),
    x: 400,
    y: 250,
    content: '<p>Click and hold to drag</p>',
  },
  {
    id: uuidv4(),
    x: 400,
    y: 150,
    content: '<p>Hello, I\'m Nuxt</p>',
  },
])
const activeId = ref<string>('')
const getRandomInt = (max: number = 1) => {
  return Math.floor(Math.random() * max)
}
const createEditor = () => {
  console.log(123)
  const position = {
    x: getRandomInt(window.innerWidth - 600),
    y: getRandomInt(window.innerHeight - 70),
  }
  const newE = {
    ...position,
    id: uuidv4(),
    content: 'x: ' + position.x + ', y: ' + position.y,
  }
  get(editorList).push(newE)
}
const onRemoveEditor = (id: string) => {
  const newList = [...editorList.value.filter((e: IEditor) => e.id !== id)]
  set(editorList, [])
  setTimeout(() => {
    set(editorList, newList)
  })
}
const onClickOutside = () => {
  dynamicRef.value.forEach((e) => e?.onClickOutside())
}
const gravity = ref<boolean>(false)
const onSetGravity = () => {
  set(gravity, !get(gravity))
}
const onClear = () => {
  set(editorList, [])
}
const areaRef = ref(null)
const heightArea = computed(() => useElementSize(areaRef)?.height.value)
</script>
<template>
  <div
    ref="areaRef"
    class="relative h-[calc(100vh-70px)] max-w-screen-2xl overflow-hidden z-10"
    @click="onClickOutside"
  >
    <div class="flex">
      <UButton icon="mdi:plus" @click="createEditor"> Create </UButton>
      <UButton
        :color="gravity ? 'primary' : 'white'"
        class="ml-4"
        @click="onSetGravity"
      >
        Gravity
      </UButton>
      <UButton class="ml-4" @click="onClear"> Clear </UButton>
    </div>
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
        gravity,
        heightArea,
      }"
      v-model:x="editor.x"
      v-model:y="editor.y"
      @click-outside="onClickOutside"
      @remove="onRemoveEditor"
      @disabled-gravity="gravity = false"
    />
  </div>
</template>
