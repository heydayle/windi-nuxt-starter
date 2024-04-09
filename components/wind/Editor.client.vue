<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
useSeoMeta({
  title: 'Moving editor',
})
const props = defineProps<{
  x: number
  y: number
  content: string
  data?: { id: string }
}>()
const editor = useEditor({
  content: props.content,
  extensions: [TiptapStarterKit, Text],
})
const refEditor = ref<HTMLElement | null>(null)

const draggable = ref<boolean>(true)
const throttleDrag = 1
const edgeDraggable = false
const startDragRotate = 0
const throttleDragRotate = 0
const resizable = ref<boolean>(false)
const keepRatio = false
const snappable = true
const bounds = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  position: 'css',
}
const edge = []
const targetRef = ref(null)
const moveableRef = ref(null)
const tiptapRef = ref(null)
const onDrag = (e) => {
  e.target.style.transform = e.transform
}
const onResize = (e) => {
  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`
  e.target.style.transform = e.drag.transform
}
const onBound = (e) => {
  // console.log(e)
}
const activeInput = () => {
  resizable.value = false
  editor.value.commands.focus('end')
}
const activeDrag = () => {
  resizable.value = true
}
</script>
<template>
  <div class="">
    <div ref="refEditor" class="">
      <div
        ref="targetRef"
        class="target absolute w-60 h-fit"
        :style="{ left: x + 'px', top: y + 'px' }"
        @dblclick.stop="activeInput"
        @click.stop="activeDrag"
      >
        <div class="space-x-2 mb-4 absolute -top-10">
          <UButton
            :disabled="!editor?.can().chain().focus().toggleBold().run()"
            :color="editor?.isActive('bold') ? 'primary' : 'white'"
            @click="editor?.chain().focus().toggleBold().run()"
          >
            <b>B</b>
          </UButton>
          <UButton
            :disabled="!editor?.can().chain().focus().toggleItalic().run()"
            :color="editor?.isActive('italic') ? 'primary' : 'white'"
            @click="editor?.chain().focus().toggleItalic().run()"
          >
            <i>I</i>
          </UButton>
          <UButton
            :disabled="!editor?.can().chain().focus().toggleCode().run()"
            :color="editor?.isActive('code') ? 'primary' : 'white'"
            @click="editor?.chain().focus().toggleCode().run()"
          >
            Code
          </UButton>
        </div>
        <TiptapEditorContent
          ref="tiptapRef"
          class="tiptap-element border border-1 border-gray-300 h-full rounded-lg active:outline-0 focus:outline-0"
          :editor="editor"
        />
      </div>
      <Moveable
        ref="moveableRef"
        :target="targetRef"
        :draggable="draggable"
        :throttle-drag="throttleDrag"
        :edge-draggable="edgeDraggable"
        :start-drag-rotate="startDragRotate"
        :throttle-drag-rotate="throttleDragRotate"
        :resizable="resizable"
        :keep-ratio="keepRatio"
        :snappable="snappable"
        :bounds="bounds"
        :edge="edge"
        @drag="onDrag"
        @resize="onResize"
        @bound="onBound"
      />
    </div>
  </div>
</template>
<style lang="scss">
.tiptap-element {
  .tiptap {
    @apply px-4 py-2 active:outline-0 focus:outline-0 h-full;
  }
}
.moveable-control-box {
  .moveable-origin {
    display: none;
  }
}
</style>
