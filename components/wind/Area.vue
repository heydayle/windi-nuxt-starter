<script setup lang="ts">
import { get, set, useElementSize } from '@vueuse/core'
import { useMovingEditorV2 } from '~/composables/movingEditorV2'
useSeoMeta({
  title: 'Moving editor',
})
definePageMeta({ layout: 'area' })
const props = defineProps<{ isA?: boolean }>()
const emits = defineEmits([
  'clickOutArea'
])
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
  emits('clickOutArea', { isA: props.isA || false })
  if (value.id === get(activeId)) {
    return
  }
  const beforeItem = editorList.value[activeIndex.value]
  if (beforeItem && value.id !== get(activeId)) {
    beforeItem.resizable = false
    beforeItem.isFocused = false
  }
  const item = editorList.value[value.index]
  if (value.id !== get(activeId)) {
    item.resizable = true
  }
  activeId.value = value.id
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
interface IUpdate {
  action: string
  key: string
  value: string | number | boolean
  index: number
}
const ACTIONS_KEY = {
  EDITOR: 'EDITOR_KEY',
  GENERAL: 'GENERAL_KEY',
}
const EDITOR_KEY = {
  POSITION_X: 'x',
  POSITION_Y: 'y',
  CONTENT: 'content',
  DRAGGABLE: 'draggable',
  RESIZABLE: 'resizable',
  IS_FOCUSED: 'isFocused',
}
const GENERAL_KEY = {
  ACTIVE_ID: 'activeId',
}
const onUpdateEditor = (
  key: string,
  value: string | number | boolean,
  index: number,
) => {
  const editorItem = editorList.value[index]
  if (!editorItem) return
  editorItem[key] = value
}
const onUpdateGeneral = (key: string, value: string | number | boolean) => {
  console.log(key)
  console.log(value)
}
const onUpdate = (options: IUpdate) => {
  switch (options.action) {
    case ACTIONS_KEY.GENERAL:
      onUpdateGeneral(options.key, options.value)
      break
    case ACTIONS_KEY.EDITOR:
      onUpdateEditor(options.key, options.value, options.index)
      break
  }
}
interface IUpdatePosition {
  value: { x: number; y: number }
  index: number
}
const onUpdatePosition = (options: IUpdatePosition) => {
  const { value, index } = options
  const editorItem = editorList.value[index]
  if (!editorItem) return
  editorItem.x = value.x
  editorItem.y = value.y
}
const onRemove = (index: number) => {
  onRemoveEditor(index)
  set(activeId, '')
  set(activeIndex, -1)
}
const gravity = ref<boolean>(false)
const onSetGravity = () => {
  set(gravity, !get(gravity))
}

const areaRef = ref(null)
const heightArea = useElementSize(areaRef)?.height
defineExpose({ onClickOutside })
</script>
<template>
  <div
    ref="areaRef"
    class="area relative h-[calc(100vh-70px)] w-full overflow-hidden z-10"
    @click="onClickOutside"
  >
    <div class="flex mb-4">
      <UButton icon="mdi:plus" @click="createEditor"> Create </UButton>
      <UButton
        :color="gravity ? 'primary' : 'white'"
        class="ml-4"
        @click="onSetGravity"
      >
        Gravity
      </UButton>
      <UButton class="ml-4" @click="onClear"> Clear </UButton>
      <UBadge class="ml-4" variant="outline"
        >Active Index: {{ activeIndex }}</UBadge
      >
    </div>
    <WindEditorV2
      v-for="(editor, index) in editorList"
      :key="index"
      v-bind="{
        ...editor,
        activeId,
        gravity,
        heightArea,
        index,
      }"
      @update="onUpdate"
      @update-position="onUpdatePosition"
      @click-outside="onClickOutside"
      @click="onClick"
      @dblclick="onDbClick"
      @remove="onRemove"
      @disabled-gravity="gravity = false"
    />
  </div>
</template>
