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
  activeId: string
  gravity: boolean
  heightArea: number
  draggable: boolean
  resizable: boolean
  rotatable: boolean
  isFocused: boolean
  index: number
  scale: number
}>()
const emits = defineEmits([
  'clickOutside',
  'remove',
  'disabledGravity',
  'click',
  'dblclick',
  'update',
  'updatePosition',
  'update:draggable',
])

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

const editor = useEditor({
  content: props.content,
  extensions: [TiptapStarterKit, Underline],
})
const refEditor = ref<HTMLElement | null>(null)

const throttleDrag = 1
const edgeDraggable = true
const startDragRotate = 0
const throttleDragRotate = 0
const keepRatio = false
const snappable = true
const scalable = true
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
  editor.value?.commands?.setContent(
    `x: ${Math.round(e.left)}, y: ${Math.round(e.top)}`,
  )
  emits('updatePosition', {
    value: { x: e.left, y: e.top },
    index: props.index,
  })
}
const onResize = (e: any) => {
  getHeightEditor()
  e.target.style.width = `${e.width}px`
  e.target.style.height = `${e.height}px`
  e.target.style.transform = e.drag.transform
  emits('updatePosition', {
    value: { x: e.left, y: e.top },
    index: props.index,
  })
  moveableStyle.height = e.height
}
const onRotate = (e: any) => {
  e.target.style.transform = e.drag.transform
}
const onDbClick = (id: string) => {
  emits('dblclick', { id: id, index: props.index })
  editor.value?.commands.focus('end')
}
const onClick = (id: string) => {
  if (id !== props.activeId) {
    editor.value?.commands.blur()
  }
  emits('click', { id: id, index: props.index })
}
const onClickOutside = () => {
  emits('update', {
    action: ACTIONS_KEY.EDITOR,
    key: EDITOR_KEY.IS_FOCUSED,
    value: false,
    index: props.index,
  })
  emits('update', {
    action: ACTIONS_KEY.EDITOR,
    key: EDITOR_KEY.RESIZABLE,
    value: false,
    index: props.index,
  })
}
const onRemove = () => {
  emits('update', {
    action: ACTIONS_KEY.EDITOR,
    key: EDITOR_KEY.RESIZABLE,
    value: false,
    index: props.index,
  })
  emits('remove', props.index)
}
const onEnableDrag = () => {
  emits('update', {
    action: ACTIONS_KEY.EDITOR,
    key: EDITOR_KEY.DRAGGABLE,
    value: !props.draggable,
    index: props.index,
  })
}
const getHeightEditor = () => {
  const elTipTap = document.querySelector(`.tiptap-element-${props.id}`)
  editorStyle.minHeight = elTipTap?.offsetHeight
}
const contents = computed(() => editor.value?.getHTML())
watch(
  contents,
  () => {
    emits('update', {
      action: ACTIONS_KEY.EDITOR,
      key: EDITOR_KEY.CONTENT,
      value: contents,
      index: props.index,
    })
    getHeightEditor()
    const elTipTap = document.querySelector(`.tiptap-element-${props.id}`)
    if (elTipTap?.offsetHeight > moveableStyle.height) {
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
      value < moveableStyle.height ? value : moveableStyle.height
  },
)
const { pause, resume, isActive } = useIntervalFn(() => {
  emits('update', {
    action: ACTIONS_KEY.EDITOR,
    key: EDITOR_KEY.POSITION_Y,
    value: props.y + 0.98,
    index: props.index,
  })
  moveableRef.value?.request(
    'draggable',
    {
      y: props.y + 0.98,
    },
    true,
  )
}, 1)
onMounted(() => {
  emits('disabledGravity')
})
watch(
  () => props.gravity,
  (value) => {
    if (value && props.draggable) {
      resume()
    } else pause()
  },
  { immediate: true },
)
defineExpose({ onClickOutside })
</script>
<template>
  <div class="">
    <div class="flex space-x-4 items-center">
      <div>{{ index }}</div>
      <UCheckbox
        :model-value="draggable"
        name="Draggable"
        label="Draggable"
        disabled
      />,
      <UCheckbox
        :model-value="isFocused"
        name="Focused"
        label="Focused"
        disabled
      />,
      <UCheckbox
        :model-value="resizable"
        name="Active"
        label="Active"
        disabled
      />,
      <div>{{ content }}</div>
    </div>
    <div ref="refEditor" class="">
      <div
        ref="targetRef"
        class="target absolute min-w-60 min-h-10 h-fit bg-black"
        :class="
          isFocused ? 'cursor-text' : draggable ? 'cursor-move' : 'cursor-text'
        "
        :style="{
          left: x + 'px',
          top: y + 'px',
          'min-height': editorStyle.minHeight + 'px',
          height: moveableStyle.height + 'px',
        }"
        @dblclick.stop="onDbClick(id)"
        @click.stop="onClick(id)"
      >
        <div class="absolute -top-5 -left-4">{{ index }}</div>
        <div
          v-if="isFocused"
          class="space-x-2 mb-4 min-w-60 absolute -top-10 z-10 overflow-visible"
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
        </div>
        <div
          v-if="resizable"
          class="absolute flex flex-col -top-4 -right-10 z-10"
        >
          <UButton
            icon="mdi:close"
            color="black"
            variant="ghost"
            size="2xs"
            @click.stop="onRemove"
          >
          </UButton>
          <UButton
            :color="draggable ? 'primary' : 'gray'"
            icon="simple-line-icons:cursor-move"
            :variant="draggable ? 'solid' : 'ghost'"
            size="2xs"
            @click.stop="onEnableDrag"
          >
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
        @rotate="onRotate"
      />
    </div>
  </div>
</template>
<style lang="scss">
.tiptap-element {
  .tiptap {
    @apply px-4 py-2 active:outline-0 focus:outline-0 h-auto text-center;
  }
}
.moveable-control-box {
  .moveable-origin {
    display: none;
  }
}
</style>
