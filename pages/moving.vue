<script setup lang="ts">
import { get, set, useElementSize } from '@vueuse/core'
import { useMovingEditor } from '~/composables/movingEditor'
useSeoMeta({
  title: 'Moving editor',
})
definePageMeta({ layout: 'area' })

const dynamicRef = ref([])
const activeId = ref<string>('')
const { editorList, createEditor, onRemoveEditor, onClear } = useMovingEditor()
const onClickOutside = () => {
  dynamicRef.value.forEach((e) => e?.onClickOutside())
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
    <WindEditor
      v-for="(editor, index) in editorList"
      :ref="
        (el: HTMLElement) => {
          dynamicRef[index] = el
        }
      "
      :key="index"
      v-bind="{
        ...editor,
        gravity,
        heightArea,
      }"
      v-model:activeId="activeId"
      v-model:x="editor.x"
      v-model:y="editor.y"
      @click-outside="onClickOutside"
      @remove="onRemoveEditor"
      @disabled-gravity="gravity = false"
    />
  </div>
</template>
