<script setup lang="ts">
import Moveable from 'vue3-moveable'
import { ref } from 'vue'
import Underline from '@tiptap/extension-underline'
import { useIntervalFn } from '@vueuse/core'
useSeoMeta({
  title: 'Moving editor',
})
const props = defineProps<{
  x: number
  y: number
  content: string
  id: string
  activeId: string | number
  gravity: boolean
  heightArea: number
}>()
const emits = defineEmits([
  'update:activeId',
  'clickOutside',
  'remove',
  'update:x',
  'update:y',
  'disabledGravity',
])
const editor = useEditor({
  content: props.content,
  extensions: [
    TiptapStarterKit,
    Underline
  ],
})
const refEditor = ref<HTMLElement | null>(null)

const draggable = ref<boolean>(true)
const rotatable = ref<boolean>(true)
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
const editorStyle = reactive({
  width: 0,
  height: 0,
  minHeight: 40,
})
const moveableStyle = reactive({
  width: 0,
  height: 0,
  minHeight: 'auto',
})
const onDrag = (e: any) => {
  const rotate = e.transform.match(/rotate\((.+)\)/)
  if (rotate && rotate.length) e.target.style.transform = `rotate(${rotate[1]})`
  emits('update:x', e.left)
  emits('update:y', e.top)
  editor.value?.commands?.setContent(
    `x: ${Math.round(e.left)}, y: ${Math.round(e.top)}`,
  )
}
const onResize = (e: any) => {
  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`
  moveableStyle.height = e.height
}
const onRotate = (e: any) => {
  e.target.style.transform = e.drag.transform
}
const onBound = (e) => {
  // console.log(e)
}
const isFocused = ref(false)
const onDbClick = () => {
  if (isFocused.value) return
  isFocused.value = true
  resizable.value = !isFocused.value
  editor.value?.commands.focus('end')
}
const onClick = (id: string | number) => {
  emits('clickOutside')
  emits('update:activeId', id)
  if (id !== props.activeId) {
    editor.value?.commands.blur()
  }
  setTimeout(() => {
    resizable.value = id != -1 ? !isFocused.value : false
  })
}
const active = computed(() => props.activeId)
watch(active, () => {
  resizable.value = active.value === props.id
})
const onClickOutside = () => {
  isFocused.value = false
  resizable.value = false
}
const onRemove = (id: string) => {
  emits('update:activeId', -1)
  resizable.value = false
  emits('remove', id)
}
const contents = computed(() => editor.value?.getHTML())
watch(
  contents,
  () => {
    const elTipTap = document.querySelector(`.tiptap-element-${props.id}`)
    if (elTipTap?.offsetHeight > moveableStyle.height) {
      editorStyle.height = elTipTap?.offsetHeight
      moveableRef.value?.request(
        'resizable',
        {
          offsetWidth: elTipTap?.offsetWidth,
          offsetHeight: elTipTap?.offsetHeight,
        },
        true,
      )
    }
  },
  { deep: true },
)
watch(
  () => editorStyle.height,
  (value) => {
    editorStyle.minHeight = value
    moveableStyle.height =
      value < moveableStyle.height ? moveableStyle.height : value
  },
)
watch(
  () => moveableStyle.height,
  (value) => {
    editorStyle.minHeight =
      value > editorStyle.height ? editorStyle.height : value
  },
)
const { pause, resume, isActive } = useIntervalFn(() => {
  emits('update:y', props.y + 0.98)
  moveableRef.value?.request(
    'draggable',
    {
      y: props.y + 0.98,
    },
    true,
  )
}, 1)
onMounted(() => {
  // pause()
  emits('disabledGravity')
})
watch(
  () => props.gravity,
  (value) => {
    if (value) {
      resume()
    } else pause()
  },
  { immediate: true },
)
defineExpose({ onClickOutside })
</script>
<template>
  <div class="">
    <div ref="refEditor" class="">
      <div
        ref="targetRef"
        class="target absolute min-w-60 min-h-10 h-fit"
        :class="isFocused ? 'cursor-text' : 'cursor-move'"
        :style="{
          left: x + 'px',
          top: y + 'px',
          'min-height': editorStyle.minHeight + 'px',
          height: moveableStyle.height + 'px',
        }"
        @dblclick.stop="onDbClick"
        @click.stop="onClick(id)"
      >
        <div
          v-if="isFocused"
          class="space-x-2 mb-4 min-w-60 absolute -top-10 z-10"
        >
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
          <UButton
            :color="editor?.isActive({ dir: 'rtl' }) ? 'primary' : 'white'"
          >
            <u>RTL</u>
          </UButton>
        </div>
        <div v-if="resizable" class="absolute -top-10 -right-10 z-10">
          <UButton
            color="black"
            variant="outline"
            circle
            :ui="{ rounded: 'rounded-full' }"
            @click.stop="onRemove(id)"
          >
            <Icon name="mdi:close" />
          </UButton>
        </div>
        <TiptapEditorContent
          class="tiptap-element h-auto active:outline-0 focus:outline-0"
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
          rotatable,
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
        @rotate="onRotate"
      />
    </div>
  </div>
</template>
<style lang="scss">
.tiptap-element {
  .tiptap {
    @apply px-4 py-2 active:outline-0 focus:outline-0 h-auto text-center flex flex-col justify-center items-center;
  }
}
.moveable-control-box {
  .moveable-origin {
    display: none;
  }
}
</style>
