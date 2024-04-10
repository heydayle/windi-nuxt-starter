<script setup lang="ts">
import Moveable from 'vue3-moveable'
import { ref } from 'vue'
import Underline from '@tiptap/extension-underline'
import moveable from 'vue3-moveable/src/components/Moveable.vue'
useSeoMeta({
  title: 'Moving editor',
})
const props = defineProps<{
  x: number
  y: number
  content: string
  id: string | number
  activeId: string | number
}>()
const emits = defineEmits(['update:activeId', 'clickOutside'])
const editor = useEditor({
  content: props.content,
  extensions: [TiptapStarterKit, Underline],
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
const onDrag = (e: any) => {
  e.target.style.transform = e.transform
}
const onResize = (e: any) => {
  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`
  e.target.style.transform = e?.drag?.transform
}
const onBound = (e) => {
  // console.log(e)
}
const onDbClick = () => {
  resizable.value = false
  editor.value?.commands.focus('end')
}
const onClick = (id: string | number) => {
  emits('update:activeId', id)
  if (id !== props.activeId) {
    editor.value?.commands.blur()
  }
  setTimeout(() => {
    resizable.value = props.activeId === props.id
  })
}
const active = computed(() => props.activeId)
watch(active, () => {
  resizable.value = active.value === props.id
})
const onClickOutside = () => {
  onClick(-1)
}
const contents = computed(() => editor.value?.getHTML())
watch(
  contents,
  () => {
    const elTipTap = document.querySelector(`.tiptap-element-${props.id}`)
    moveableRef.value?.request(
      'resizable',
      {
        offsetWidth: elTipTap?.offsetWidth,
        offsetHeight: elTipTap?.offsetHeight,
      },
      true,
    )
  },
  { deep: true },
)
defineExpose({ onClickOutside })
</script>
<template>
  <div class="">
    <div ref="refEditor" class="">
      <div
        ref="targetRef"
        class="target absolute min-w-40 min-h-10 h-fit"
        :style="{ left: x + 'px', top: y + 'px' }"
        @dblclick.stop="onDbClick"
        @click.stop="onClick(id)"
      >
        <div class="space-x-2 mb-4 min-w-60 absolute -top-10">
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
            :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
            :color="editor?.isActive('underline') ? 'primary' : 'white'"
            @click="editor?.chain().focus().toggleUnderline().run()"
          >
            <u>U</u>
          </UButton>
        </div>
        <TiptapEditorContent
          class="tiptap-element h-full active:outline-0 focus:outline-0"
          :class="`tiptap-element-${id}`"
          :editor="editor"
        />
      </div>
      <Moveable
        ref="moveableRef"
        :class="'moveable-' + id"
        :target="targetRef"
        v-bind="{
          draggable,
          throttleDrag,
          edgeDraggable,
          startDragRotate,
          throttleDragRotate,
          resizable,
          keepRatio,
          snappable,
          bounds,
          edge,
        }"
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
    @apply px-4 py-2 active:outline-0 focus:outline-0 h-full text-center flex flex-col justify-center items-center;
  }
  @apply h-auto;
}
.moveable-control-box {
  .moveable-origin {
    display: none;
  }
}
</style>
