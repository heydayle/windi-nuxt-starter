<script setup lang="ts">
import { get, set, useElementSize } from '@vueuse/core'
import { useMovingEditorV2 } from '~/composables/movingEditorV2'
useSeoMeta({
  title: 'Moving editor',
})
definePageMeta({ layout: 'area' })

const activeId = ref<string>('')
const activeIndex = ref<number>(-1)
const { editorList, createEditor, onRemoveEditor, onClear } =
  useMovingEditorV2()
const onClickOutside = () => {
  const beforeItem = editorList.value[activeIndex.value]
  if (beforeItem) {
    beforeItem.resizable = false
    beforeItem.isFocused = false
  }
  activeId.value = ''
  activeIndex.value = -1
}
const onClick = (value: { id: string; index: number }) => {
  const beforeItem = editorList.value[activeIndex.value]
  if (beforeItem && value.id !== get(activeId)) {
    beforeItem.resizable = false
    beforeItem.isFocused = false
  }
  const item = editorList.value[value.index]
  if (value.id !== get(activeId)) {
    item.resizable = true
  }
  set(activeId, value.id)
  set(activeIndex, value.index)
}
const onDbClick = (value: { id: string; index: number }) => {
  const beforeItem = editorList.value[activeIndex.value]
  if (beforeItem && value.id !== get(activeId)) {
    beforeItem.resizable = false
    beforeItem.isFocused = false
  }
  set(activeId, value.id)
  set(activeIndex, value.index)
  const item = editorList.value[value.index]
  item.resizable = false
  item.isFocused = true
}
const gravity = ref<boolean>(false)
const onSetGravity = () => {
  set(gravity, !get(gravity))
}

const areaRef = ref(null)
const heightArea = useElementSize(areaRef)?.height
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
    <WindEditorV2
      v-for="(editor, index) in editorList"
      :key="index"
      v-bind="{
        ...editor,
        gravity,
        heightArea,
        index,
      }"
      v-model:activeId="activeId"
      v-model:x="editor.x"
      v-model:y="editor.y"
      v-model:content="editor.content"
      v-model:draggable="editor.draggable"
      v-model:resizable="editor.resizable"
      v-model:isFocused="editor.isFocused"
      @click-outside="onClickOutside"
      @click="onClick"
      @dbclick="onDbClick"
      @remove="onRemoveEditor"
      @disabled-gravity="gravity = false"
    />
  </div>
</template>
