<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'
useSeoMeta({
  title: 'Moving editor',
})
const props = defineProps<{
  x: number
  y: number
  content: string
}>()
const editor = useEditor({
  content: props.content,
  extensions: [TiptapStarterKit],
})
const refEditor = ref<HTMLElement | null>(null)

const { x, y, style } = useDraggable(refEditor, {
  initialValue: { x: props.x, y: props.y },
})
</script>
<template>
  <div class="relative h-screen">
    <div ref="refEditor" :style="style" class="fixed w-60">
      <div class="space-x-2 mb-4">
        <UButton
          @click="editor?.chain().focus().toggleBold().run()"
          :disabled="!editor?.can().chain().focus().toggleBold().run()"
          :color="editor?.isActive('bold') ? 'primary' : 'white'"
        >
          <b>B</b>
        </UButton>
        <UButton
          @click="editor?.chain().focus().toggleItalic().run()"
          :disabled="!editor?.can().chain().focus().toggleItalic().run()"
          :color="editor?.isActive('italic') ? 'primary' : 'white'"
        >
          <i>I</i>
        </UButton>
        <UButton
          @click="editor?.chain().focus().toggleCode().run()"
          :disabled="!editor?.can().chain().focus().toggleCode().run()"
          :color="editor?.isActive('code') ? 'primary' : 'white'"
        >
          Code
        </UButton>
      </div>
      <TiptapEditorContent
        class="tiptap-element border border-1 border-gray-300 rounded-lg active:outline-0 focus:outline-0"
        :editor="editor"
      />
    </div>
  </div>
</template>
<style lang="scss">
.tiptap-element {
  .tiptap {
    @apply px-4 py-2 active:outline-0 focus:outline-0 h-60;
  }
}
</style>
