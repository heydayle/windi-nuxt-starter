<script setup lang="ts">
import type { Ref } from 'vue'
import _ from 'lodash'
import { useRouteQuery } from '@vueuse/router'
import type { ApiResponseModule } from '~/lib/types/ApiResponse'
import {
  addTextShadow,
  getContrastYIQ,
  replaceBreakLineHtml,
} from '~/lib/utils'
import type { CommonModule } from '~/lib/types/Common'
import {
  ACTION_INTO_EDITOR,
  MAX_TEXT_BOX_LENGTH,
  TEXT_BOX_PREFIX_INDEX,
  TEXT_BOX_TYPES,
  TRANSLATOR_LOADING_TYPES,
} from '~/lib/constants'

const props = defineProps<{
  images: CommonModule.SelectedImage[]
  coverRectangles: ApiResponseModule.PostOcrGoogleVisionData[]
  rectangles: ApiResponseModule.PostOcrGoogleVisionData[]
  zoomScaleRatio: number
  showCoverBox: boolean
  showOcrBox: boolean
  showOcrText: boolean
  showNotes: boolean
  isTranslatedImages: boolean
  drawNewTextBox: boolean
  drawNewNote: boolean
  selectedOriginalId: number
  selectedId: number
  oldTextBox: CommonModule.OldTextBox
  isHideOriginalTextBoxs: boolean
  editorArea: null | 'translate' | 'original'
}>()

const emits = defineEmits([
  'update:rectangles',
  'removeRectangle',
  'createRectangle',
  'handleActionIntoEditor',
  'update:selectedOriginalId',
  'update:selectedId',
  'update:saveChapterSilently',
  'update:editorArea',
  'update:showNotes',
])

enum KEY_BOARD {
  DELETE = 'Delete',
}

enum USER_ROLE {
  STANDARD = 'STANDARD',
  EXTERNAL = 'EXTERNAL',
  ROOT = 'ROOT',
}
const isOverMaxContent = ref<boolean>(false)
const showNotes = useVModel(props, 'showNotes', emits)
const imgContainerElement: Ref<HTMLElement | undefined> = ref()
const imgTransformContainerElement: Ref<HTMLElement | undefined> = ref()
const imgElements: Ref<HTMLImageElement[]> = ref([])
const { width: imgContainerElementWidth }
    = useElementSize(imgContainerElement)
const {
  width: imgTransformContainerElementWidth,
  height: imgTransformContainerElementHeight,
} = useElementSize(imgTransformContainerElement)
const aspectRatio = computed(
  () =>
    imgTransformContainerElementWidth.value
    / imgTransformContainerElementHeight.value,
)
const maxNaturalImageWidth = ref(0)
const transformScaleCssVar = useCssVar(
  '--transform-scale',
  imgContainerElement,
  { initialValue: '1' },
)
const transformScale = computed(() =>
  maxNaturalImageWidth.value > 0
    ? imgContainerElementWidth.value / maxNaturalImageWidth.value
    : 1.0,
)
watch(transformScale, (newVar) => {
  transformScaleCssVar.value = newVar.toString()
})
watch(
  () => props.images,
  () => {
    maxNaturalImageWidth.value = 0
  },
)
const isUpdateFromToolbar = ref<boolean>(false)
const isAutoFixHeight = ref<boolean>(false)
const appStore = useAppStore()
const imgEditToolbarWidth = ref<number>(470)
const imgNoteWidth = ref<number>(270)
const timer = ref()
const rectangleWithColorAndText = useVModel(props, 'rectangles', emits)
const selectedOriginalId = useVModel(props, 'selectedOriginalId', emits)
const selectedId = useVModel(props, 'selectedId', emits)
const getCoverRectangles = computed(() => props.coverRectangles)
const isEditRectangleContent = ref<boolean>(false)
const editChapterState = useRouteQuery('editState')
const isEditChapterMode = computed(() => editChapterState.value === 'true')
const isChapterQuery = useRouteQuery('id')
const isNotUpdate = computed(() => isChapterQuery.value && !isEditChapterMode.value)
const isNewDrawingTextBox = ref<boolean>(false)
const shadows = ref<any>({})
const refInputTranslate = ref()
const refInputOriginal = ref()
function isToolBarOverRightImageSide(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
  elWidth: number,
) {
  const scaledOffSetX = elWidth / 2
  return (elWidth + rect?.WIDTH / 2 + rect?.COMBINED_X) - maxNaturalImageWidth.value > scaledOffSetX
}

function noteOverImageWidthOffset(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
  elWidth: number,
) {
  const scaledOffSetX = 28 * Number.parseFloat(transformScaleCssVar.value)
  return (elWidth + rect?.COMBINED_X + scaledOffSetX) - 0.85 * maxNaturalImageWidth.value > 0 ? elWidth / 2 : ''
}

function handleOverImageHeight(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
) {
  const noteHeight = 46
  const scaledNoteHeight = (noteHeight / Number.parseFloat(transformScaleCssVar.value) * props.zoomScaleRatio)
  const offSetY
      = (rect?.HEIGHT + rect?.COMBINED_Y) + scaledNoteHeight
      - imgTransformContainerElementHeight.value
  return offSetY > 0
    ? `${-(rect?.HEIGHT + scaledNoteHeight)}px`
    : `0`
}

const allRect = computed(() => rectangleWithColorAndText.value?.map((rect: ApiResponseModule.PostOcrGoogleVisionData) => updateTextBoxMissingFields(rect)))
const userCreateRect = computed(() => allRect.value
  ?.filter((rect: ApiResponseModule.PostOcrGoogleVisionData) => rect.TEXT_BOX_TYPE === TEXT_BOX_TYPES.MANUALLY))
const psdCreateRect = computed(() => allRect.value
  ?.filter((rect: ApiResponseModule.PostOcrGoogleVisionData) => rect.TEXT_BOX_TYPE === TEXT_BOX_TYPES.UPLOAD_PSD))
const excelCreateRect = computed(() => allRect.value
  ?.filter((rect: ApiResponseModule.PostOcrGoogleVisionData) => rect.TEXT_BOX_TYPE === TEXT_BOX_TYPES.IMPORT_EXCEL))
const visionCreateRect = computed(() => allRect.value
  ?.filter((rect: ApiResponseModule.PostOcrGoogleVisionData) => rect.TEXT_BOX_TYPE === TEXT_BOX_TYPES.OCR || rect.TEXT_BOX_TYPE === TEXT_BOX_TYPES.BRING))
const userCreateNote = computed(() => allRect.value
  ?.filter((rect: ApiResponseModule.PostOcrGoogleVisionData) => rect.TEXT_BOX_TYPE === TEXT_BOX_TYPES.NOTE))

function updateTextBoxMissingFields(rect: ApiResponseModule.PostOcrGoogleVisionData) {
  if (!rect.ORIGINAL_TEXT_BOX_ID)
    rect.ORIGINAL_TEXT_BOX_ID = rect.ID
  if (!rect?.TEXT_SHADOW && rect.FONT_SIZE) {
    const fontSizeNumber = Number.parseInt(rect.FONT_SIZE.replace('px', ''))
    rect.TEXT_SHADOW = shadows.value[`${fontSizeNumber}_${rect.TEXT_COLOR}`]
  }
  if (rect?.TEXT_SHADOW)
    rect.TEXT_UNDERLINE_OFFSET = getTextUnderlineOffset(rect)
  return rect
}

onBeforeMount(() => {
  renderTextShadow()
})
onMounted(() => {
  onAddListener()
  refInputTranslate.value = document.querySelector('#input-translate')
  refInputOriginal.value = document.querySelector('#input-original')
})
onUnmounted(() => {
  onRemoveListener()
})
function onAddListener() {
  if (props.isTranslatedImages) {
    refInputTranslate.value?.focus()
    refInputTranslate.value?.addEventListener('keyup', handleKeyUp, true)
  }
  else {
    refInputOriginal.value?.focus()
    refInputOriginal.value?.addEventListener('keyup', handleKeyUp, true)
  }
}
function onRemoveListener() {
  const elTranslate = document.querySelector('#input-translate')
  const elOriginal = document.querySelector('#input-original')
  elTranslate?.removeEventListener('keyup', handleKeyUp, true)
  elOriginal?.removeEventListener('keyup', handleKeyUp, true)
}
function reFocusEl() {
  if (props.isTranslatedImages)
    refInputTranslate.value?.focus()
  else refInputOriginal.value?.focus()
}
function handlerFocusAllText(rectangle: ApiResponseModule.PostOcrGoogleVisionData) {
  if (rectangle.TEXT_BOX_TYPE === TEXT_BOX_TYPES.NOTE)
    return
  if (!isEditRectangleContent.value) {
    timer.value = setTimeout(() => {
      const el
          = document.getElementById(`rectangle-content-${rectangle.ORIGINAL_TEXT_BOX_ID}-${props.isTranslatedImages ? 'translated' : 'original'}`) as HTMLElement
      const range: Range = new Range()
      range.selectNodeContents(el)
      document.getSelection()?.removeAllRanges()
      document.getSelection()?.addRange(range)
    }, 0)
  }
  else {
    document.execCommand('selectAll', false, undefined)
  }
}
function renderTextShadow() {
  for (let i = 1; i <= 200; i++) {
    shadows.value[`${i}_#181818`] = addTextShadow('#181818', `${i}px`)
    shadows.value[`${i}_#FFFFFF`] = addTextShadow('#FFFFFF', `${i}px`)
  }
}

function handleRectDblClick(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
) {
  onRemoveListener()
  if (isNotUpdate.value)
    return
  handlerFocusAllText(rect)
  isEditRectangleContent.value = true
}
function handleMovingArea() {
  const area = props.isTranslatedImages ? TRANSLATOR_LOADING_TYPES.TRANSLATE : TRANSLATOR_LOADING_TYPES.ORIGINAL
  emits('update:editorArea', area)
}
function handleRecClick(rect: ApiResponseModule.PostOcrGoogleVisionData) {
  const isUserCreateManualTextBox = [TEXT_BOX_TYPES.MANUALLY, TEXT_BOX_TYPES.NOTE].includes(rect.TEXT_BOX_TYPE)
  if (isNotUpdate.value
    || (isUserCreateManualTextBox && selectedOriginalId.value === rect.ORIGINAL_TEXT_BOX_ID)
    || (!isUserCreateManualTextBox && selectedId.value === rect.ID))
    return
  emits('handleActionIntoEditor', { actionName: ACTION_INTO_EDITOR.RESET_SELECTED_TEXT_BOX })
  setTimeout(() => {
    selectedOriginalId.value = rect.ORIGINAL_TEXT_BOX_ID as number
    selectedId.value = rect.ID
    onAddListener()
  }, 0)
}

function clampNumber(num: number, low: number, high: number) {
  return Math.max(Math.min(num, high), low)
}

function clampRect(rect: ApiResponseModule.PostOcrGoogleVisionData) {
  const originalWidth = rect.WIDTH!
  const originalHeight = rect.HEIGHT!
  const rotationInDegrees = rect.ROTATE_DEGREE!
  const rotationInRadians = (rotationInDegrees * Math.PI) / 180
  const newWidth
      = Math.abs(originalWidth * Math.cos(rotationInRadians))
      + Math.abs(originalHeight * Math.sin(rotationInRadians)) || originalWidth
  const newHeight
      = Math.abs(originalWidth * Math.sin(rotationInRadians))
      + Math.abs(originalHeight * Math.cos(rotationInRadians)) || originalHeight

  rect.WIDTH = clampNumber(
    originalWidth,
    0,
    imgTransformContainerElementWidth.value - 2 * (3 / transformScale.value),
  )
  rect.HEIGHT = clampNumber(
    originalHeight,
    0,
    imgTransformContainerElementHeight.value - 2 * (3 / transformScale.value),
  )

  const offset = {
    x: (newWidth - originalWidth) / 2,
    y: (newHeight - originalHeight) / 2,
  }
  const borderWidth = 3
  rect.COMBINED_X
      = clampNumber(
      rect.COMBINED_X - offset.x,
      0,
      imgTransformContainerElementWidth.value
      - newWidth
      - 2 * (borderWidth / transformScale.value),
    ) + offset.x
  rect.COMBINED_Y
      = clampNumber(
      rect.COMBINED_Y - offset.y,
      0,
      imgTransformContainerElementHeight.value
      - newHeight
      - 2 * (borderWidth / transformScale.value),
    ) + offset.y
  clearTimeout(timer.value)
}
function moveEndedHandler(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
  dx: number,
  dy: number,
) {
  rect.COMBINED_X += dx
  rect.COMBINED_Y += dy
  clampRect(rect)
}

function resizeEndedHandler(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
  dx: number,
  dy: number,
  newWidth: number,
  newHeight: number,
  newRotate: number,
) {
  rect.COMBINED_X += dx
  rect.COMBINED_Y += dy
  rect.WIDTH = newWidth
  rect.HEIGHT = newHeight
  rect.ROTATE_DEGREE = newRotate
  clampRect(rect)
}

function divExpandedHandler(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
  newHeight: number,
) {
  rect.HEIGHT = newHeight
  clampRect(rect)
}

const calculateFontSizeTimeout = ref()

function textFitHandler(
  rect: ApiResponseModule.PostOcrGoogleVisionData,
  newFontSize: number,
) {
  rect.FONT_SIZE = `${newFontSize}px`

  if (appStore.userInfo?.ROLE !== USER_ROLE.STANDARD) {
    clearTimeout(calculateFontSizeTimeout.value)
    calculateFontSizeTimeout.value = setTimeout(() => {
      emits('update:saveChapterSilently')
    }, 500)
  }
}

const cachingRectStyle = ref<ApiResponseModule.PostOcrGoogleVisionData>()

function updateStyleFromToolbar(rect: ApiResponseModule.PostOcrGoogleVisionData) {
  isUpdateFromToolbar.value = true
  const updatedStyleObject = _.pick(rect, ['FONT_SIZE', 'TEXT_ALIGN', 'BACKGROUND_COLOR'])
  cachingRectStyle.value = { ...updatedStyleObject }
}
function handleCachingRectStyle() {
  if (isUpdateFromToolbar.value || !userCreateRect.value?.length || props.drawNewNote)
    return
  const arr = userCreateRect.value?.sort((a, b) => Date.parse(a.UPDATED_AT) >= Date.parse(b.UPDATED_AT) ? -1 : 1)
  const firstItem = arr[0]
  if (firstItem)
    cachingRectStyle.value = firstItem
}

defineExpose({
  updateSelectedRectangleContent,
  handleClickOutSiteRect,
  deleteRect,
})
function getContentInRectangleEditing() {
  const el = document.getElementById(`rectangle-content-${selectedOriginalId.value}-${props.isTranslatedImages ? 'translated' : 'original'}`) as HTMLElement
  return el.textContent
}

async function updateSelectedRectangleContent() {
  const idElement = `${selectedOriginalId.value}-${props.isTranslatedImages ? 'translated' : 'original'}`
  const el = document.getElementById(`rectangle-content-${idElement}`) as HTMLElement
  if (el) {
    const found = props.rectangles?.find(e => e.ORIGINAL_TEXT_BOX_ID === selectedOriginalId.value)
    if (found) {
      const content = replaceBreakLineHtml(el.innerHTML)
      if (found.TEXT_BOX_TYPE === TEXT_BOX_TYPES.NOTE)
        found.NOTE_TEXT = content

      else
        found.TEXT = content
    }
  }
}

function setManualTextBoxEntities(
  newRect: ApiResponseModule.PostOcrGoogleVisionData,
) {
  return {
    BACKGROUND_COLOR: cachingRectStyle.value?.BACKGROUND_COLOR || '#FFFFFA',
    FONT_SIZE: cachingRectStyle.value?.FONT_SIZE || '26px',
    TEXT_ALIGN: cachingRectStyle.value?.TEXT_ALIGN || 'center',
    ROTATE_DEGREE: newRect.ROTATE_DEGREE ?? 0,
    PREFIX_INDEX: TEXT_BOX_PREFIX_INDEX.MANUALLY,
    TEXT_BOX_TYPE: TEXT_BOX_TYPES.MANUALLY,
  }
}
function setNoteEntities() {
  return {
    BACKGROUND_COLOR: '#FFE278;',
    FONT_SIZE: '26px',
    TEXT_ALIGN: 'center',
    TEXT_BOX_TYPE: TEXT_BOX_TYPES.NOTE,
  }
}
function drawingRectangle(
  newRect: ApiResponseModule.PostOcrGoogleVisionData,
): void {
  if (!newRect)
    return
  if (props.drawNewNote)
    showNotes.value = true
  isNewDrawingTextBox.value = true
  handleCachingRectStyle()
  if (props.isTranslatedImages) {
    isAutoFixHeight.value = true
    const minWidth = 250
    const minHeight = 70
    const currentDate = new Date()
    const ORIGINAL_TEXT_BOX_ID = Date.now()
    const WIDTH = newRect.WIDTH === 0 ? minWidth : newRect.WIDTH
    const HEIGHT = newRect.HEIGHT < minHeight ? minHeight : newRect.HEIGHT
    const COMBINED_X = newRect.COMBINED_X
    const COMBINED_Y = newRect.COMBINED_Y
    const IS_MANUAL_CREATE_TEXT_BOX = true
    const UPDATED_AT = currentDate.toISOString()
    const rectangleStyle = newRect.TEXT_BOX_TYPE !== TEXT_BOX_TYPES.NOTE
      ? { ...setManualTextBoxEntities(newRect) }
      : { ...setNoteEntities() }
    const newRectangle = {
      WIDTH,
      HEIGHT,
      ORIGINAL_TEXT_BOX_ID,
      COMBINED_X,
      COMBINED_Y,
      IS_MANUAL_CREATE_TEXT_BOX,
      UPDATED_AT,
      ...rectangleStyle,
      isCreateNote: true,
    }
    updateSelectedRectangleContent()
    clampRect(newRectangle)
    emits('createRectangle', newRectangle)
    setTimeout(() => {
      const el = document.getElementById(`rectangle-content-${newRectangle.ORIGINAL_TEXT_BOX_ID}-translated`)
      if (el) {
        isEditRectangleContent.value = true
        selectedOriginalId.value = newRectangle.ORIGINAL_TEXT_BOX_ID as number
        el.contentEditable = `${isEditRectangleContent.value}`
        el.focus()
      }
    }, 100)
  }
}
function deleteRect(selectedOriginalId: number, rect?: ApiResponseModule.PostOcrGoogleVisionData): void {
  emits('removeRectangle', selectedOriginalId, rect)
}
function deleteRectOnKeyDown(selectedOriginalId: number, rect?: ApiResponseModule.PostOcrGoogleVisionData) {
  emits(
    'handleActionIntoEditor',
    {
      actionName: ACTION_INTO_EDITOR.DELETE_TEXT_BOX,
      isEdit: isEditRectangleContent.value,
      id: selectedOriginalId,
      rect: { ...rect, TEXT: getContentInRectangleEditing() },
      callback: reFocusEl,
    },
  )
}
function handleKeyUp(event: any): void {
  if (selectedOriginalId.value > 0 && !isEditRectangleContent.value) {
    if (event.key === KEY_BOARD.DELETE) {
      emits(
        'handleActionIntoEditor',
        {
          actionName: ACTION_INTO_EDITOR.DELETE_TEXT_BOX,
          isEdit: isEditRectangleContent.value,
          id: selectedOriginalId.value,
          callback: reFocusEl,
        },
      )
    }
  }
}

function resetValue() {
  if (isNewDrawingTextBox.value) {
    isNewDrawingTextBox.value = false
  }
  else {
    selectedOriginalId.value = -1
    selectedId.value = -1
    isEditRectangleContent.value = false
    isOverMaxContent.value = false
  }
}

function handleClickOutSiteRect(): void {
  updateSelectedRectangleContent()
  resetValue()
}

function getTextUnderlineOffset(
  rectangle: ApiResponseModule.PostOcrGoogleVisionData,
) {
  let fs = 26
  if (rectangle.FONT_SIZE)
    fs = Number.parseInt(rectangle.FONT_SIZE.replace('px', ''))

  const offset = Math.round(0.15 * fs)
  return rectangle.TEXT_SHADOW !== 'unset' ? `${offset}px` : ''
}

function checkPasteAsPlainText(e: any) {
  e.preventDefault()
  const text = (e.originalEvent || e).clipboardData.getData('text/plain')?.slice(0, MAX_TEXT_BOX_LENGTH)
  document.execCommand('insertHTML', false, text)
  if (e.target.textContent.length > MAX_TEXT_BOX_LENGTH)
    e.target.textContent = e.target.textContent?.slice(0, MAX_TEXT_BOX_LENGTH)
}

function getTextBoxIndex(rectangle: ApiResponseModule.PostOcrGoogleVisionData, index: number): string {
  return `${index < 9 ? `${rectangle.PREFIX_INDEX}0${index + 1}` : `${rectangle.PREFIX_INDEX}${index + 1}`}`
}
function getTextBoxZIndex(rectangle: ApiResponseModule.PostOcrGoogleVisionData, index: number): number {
  let zIndex = 0

  switch (rectangle.TEXT_BOX_TYPE) {
    case TEXT_BOX_TYPES.UPLOAD_PSD:
      zIndex = visionCreateRect.value.length + index
      break
    case TEXT_BOX_TYPES.IMPORT_EXCEL:
      zIndex = visionCreateRect.value.length + psdCreateRect.value.length + index
      break
    case TEXT_BOX_TYPES.MANUALLY:
      zIndex = visionCreateRect.value.length + psdCreateRect.value.length + excelCreateRect.value.length + index
      break
    case TEXT_BOX_TYPES.NOTE:
      zIndex = visionCreateRect.value.length + psdCreateRect.value.length + excelCreateRect.value.length + userCreateNote.value.length + index
      break
    default:
      zIndex = index
      break
  }

  if (rectangle.IS_FEEDBACK)
    zIndex = visionCreateRect.value.length + psdCreateRect.value.length + excelCreateRect.value.length + userCreateRect.value.length + index

  return zIndex
}
function checkEnabledArea(area: string | null) {
  return (area === TRANSLATOR_LOADING_TYPES.TRANSLATE && props.isTranslatedImages)
    || (area === TRANSLATOR_LOADING_TYPES.ORIGINAL && !props.isTranslatedImages)
}
const isOverflowVisible = computed(() => {
  return checkEnabledArea(props.editorArea)
})
const noteValue = ref<string>()
function handleKeyDown(e: any) {
  const isMac = window.navigator.userAgent.includes('Mac OS X')
  const elString = e.target.textContent
  noteValue.value = elString
  const allowedCtrKey = ['x', 'a', 'c', 'u', 'b', 'i', 'Meta', 'Ctrl']
  const keyCode = e.keyCode
  const allowKeyCode = [8, 37, 38, 39, 40, 16, 17]
  const isAllowedKeyPressed = (allowedCtrKey.includes(e.key) && (isMac ? e.metaKey : e.ctrlKey))
  const isOverPrev = isOverMaxContent.value
  if (!isAllowedKeyPressed && !allowKeyCode.includes(keyCode)) {
    isOverMaxContent.value = elString.length >= MAX_TEXT_BOX_LENGTH
    if (isOverMaxContent.value) {
      e.target.blur()
      setTimeout(() => {
        e.target.focus()
        const range = document.createRange()
        range.setStart(e.target, e.target.childNodes.length)
        if (!isOverPrev) {
          const selection = window.getSelection()
          range.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 100)
      setTimeout(() => {
        isOverMaxContent.value = false
      }, 2000)
      e.preventDefault()
    }
  }
  else { isOverMaxContent.value = false }
}
</script>

<template>
  <div
    :ref="isTranslatedImages ? 'translate' : 'original'"
    class="editor-container"
    @click="emits('handleActionIntoEditor', { actionName: ACTION_INTO_EDITOR.RESET_SELECTED_TEXT_BOX })"
  >
    <input
      :id="isTranslatedImages ? 'input-translate' : 'input-original'"
      class="tw-fixed tw-top-1/2 tw-w-0" type="text"
    >
    <div ref="imgContainerElement" :style="{ aspectRatio }">
      <div
        ref="imgTransformContainerElement"
        class="tw-absolute tw-bg-white"
        :class="{ 'tw-z-10': isOverflowVisible }"
        :style="{
          transformOrigin: 'top left',
          transform: `scale(var(--transform-scale))`,
        }"
      >
        <translate-editor-cors-image
          v-for="selectedImage in props.images"
          ref="imgElements"
          :key="selectedImage"
          :src="selectedImage.IMAGE_URL"
          :width="selectedImage.WIDTH"
          :height="selectedImage.HEIGHT"
          @update:natural-width="
            (newVal: number) =>
              (maxNaturalImageWidth = Math.max(newVal, maxNaturalImageWidth))
          "
        />
        <template v-if="!isHideOriginalTextBoxs">
          <!--          Drag create new rectangle -->
          <translate-drag-create-text-box
            v-if="drawNewTextBox && props.isTranslatedImages && !isNotUpdate"
            :text-box-type="TEXT_BOX_TYPES.MANUALLY"
            @on-drag-create-ended="drawingRectangle"
          />
          <translate-drag-create-text-box
            v-if="drawNewNote && props.isTranslatedImages && !isNotUpdate"
            :text-box-type="TEXT_BOX_TYPES.NOTE"
            @on-drag-create-ended="drawingRectangle"
          />
          <template v-if="maxNaturalImageWidth">
            <!-- COVER BOX -->
            <div
              v-show="isTranslatedImages || showOcrText"
              class="tw-absolute tw-top-0 tw-left-0"
            >
              <div
                v-for="rectangle in getCoverRectangles"
                :key="rectangle.ID"
                class="tw-absolute cover-rectangle tw-box-content"
                :style="{
                  top: `${rectangle.VISION_BOX?.COMBINED_Y}px`,
                  left: `${rectangle.VISION_BOX?.COMBINED_X}px`,
                  width: `${rectangle.VISION_BOX?.WIDTH}px`,
                  height: `${rectangle.VISION_BOX?.HEIGHT}px`,
                  backgroundColor: rectangle.VISION_BOX?.DOMINANT_COLOR,
                }"
              />
            </div>
            <!-- OCR BOX -->
            <div
              v-show="showOcrBox && !isTranslatedImages && !showOcrText"
              class="tw-absolute tw-top-0 tw-left-0"
            >
              <div
                v-for="rectangle in rectangles"
                :key="rectangle.ID"
                class="tw-absolute ocr-box tw-box-border"
                :style="{
                  top: `${rectangle.VISION_BOX?.COMBINED_Y}px`,
                  left: `${rectangle.VISION_BOX?.COMBINED_X}px`,
                  width: `${rectangle.VISION_BOX?.WIDTH}px`,
                  height: `${rectangle.VISION_BOX?.HEIGHT}px`,
                  border: `calc(3px/var(--transform-scale) * var(--zoom-scale-ratio))solid #2BD2E9`,
                }"
              />
            </div>
            <!-- OCR TEXT -->
            <div
              v-if="showOcrText || isTranslatedImages"
              class="tw-z-50 ocr-text tw-absolute tw-top-0 tw-left-0 tw-cursor-pointer"
            >
              <!--              note list -->
              <div
                v-for="(note, index) in userCreateNote"
                :key="index"
                class="tw-absolute"
                :style="{ transform: `scale(${zoomScaleRatio})`,
                          zIndex:
                            selectedOriginalId === note.ORIGINAL_TEXT_BOX_ID
                              ? '999'
                              : getTextBoxZIndex(note, index),
                }"
              >
                <translate-image-note
                  :note="note"
                  :can-move="!isNotUpdate && !isEditRectangleContent"
                  :can-resize="selectedOriginalId === note.ORIGINAL_TEXT_BOX_ID && !isEditRectangleContent"
                  :can-edit-content="selectedOriginalId === note.ORIGINAL_TEXT_BOX_ID && isEditRectangleContent"
                  :show-note-mode="showNotes"
                  :zoom-scaled="zoomScaleRatio"
                  :is-selected="selectedOriginalId === note.ORIGINAL_TEXT_BOX_ID"
                  :is-edit="isEditChapterMode"
                  :is-over-max-content="isOverMaxContent"
                  @on-expand="divExpandedHandler"
                  @on-move="moveEndedHandler"
                  @on-resize="resizeEndedHandler"
                  @click.stop="handleRecClick(note)"
                  @dblclick.stop="handleRectDblClick(note)"
                  @paste="checkPasteAsPlainText($event)"
                  @on-add-new-note="drawingRectangle({
                    ...note, COMBINED_Y: note.COMBINED_Y + note.HEIGHT + 4 })"
                  @on-delete-note="deleteRect(note.ORIGINAL_TEXT_BOX_ID)"
                  @keydown="handleKeyDown($event)"
                />
              </div>

              <!--              text box list -->
              <template
                v-for="(rects, rectsIndex) in [
                  userCreateRect,
                  visionCreateRect,
                  psdCreateRect,
                  excelCreateRect]"
                :key="rectsIndex"
              >
                <div
                  v-for="(rectangle, index) in rects"
                  :key="rectangle.ID"
                  class="tw-absolute"
                  :style="{
                    left: `${rectangle.COMBINED_X}px`,
                    top: `${rectangle.COMBINED_Y}px`,
                    zIndex: selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID ? '999' : getTextBoxZIndex(rectangle, index),
                  }"
                >
                  <translate-editor-toolbar
                    v-if="
                      isEditRectangleContent
                        && selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID
                    "
                    :style="{
                      top: `${-126 / parseFloat(transformScaleCssVar) * zoomScaleRatio}px`,
                      zIndex: '999',
                      minWidth: `${
                        rectangle.CAN_EDIT_BACKGROUND !== false
                          ? imgEditToolbarWidth
                          : 382
                      }px`,
                      position: 'absolute',
                      left: `${isToolBarOverRightImageSide(rectangle, imgEditToolbarWidth) ? '' : '50%'}`,
                      right: `${isToolBarOverRightImageSide(rectangle, imgEditToolbarWidth) ? '50%' : ''}`,
                      transform: `${isToolBarOverRightImageSide(rectangle, imgEditToolbarWidth)
                        ? 'translateX(20%)'
                        : 'translateX(-50%)'}  scale(calc(1/var(--transform-scale) * var(--zoom-scale-ratio))`,
                    }"
                    :is-right-images="isTranslatedImages"
                    :model-value="rectangle"
                    @create-rect="
                      drawingRectangle({
                        ...rectangle,
                        COMBINED_X: rectangle.COMBINED_X + rectangle.WIDTH + 20,
                      })
                    "
                    @delete-rect="deleteRect(rectangle.ORIGINAL_TEXT_BOX_ID)"
                    @update:model-value="(newValue: ApiResponseModule.PostOcrGoogleVisionData) => (rectangle = newValue)"
                    @update:style="updateStyleFromToolbar"
                  />
                  <div
                    v-expand="{
                      enabled:
                        rectangle.FONT_SIZE
                        && selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID,
                      heightUpdated: (newHeight: number) =>
                        divExpandedHandler(rectangle, newHeight),
                    }"
                    v-resize="{
                      enabled:
                        selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID && !isEditRectangleContent,
                      resizeEnded: (dx:number, dy: number, newWidth: number, newHeight: number, newRotate: number) =>
                        resizeEndedHandler(
                          rectangle,
                          dx,
                          dy,
                          newWidth,
                          newHeight,
                          newRotate,
                        ),
                    }"
                    v-move="{
                      enabled: !isNotUpdate && !isEditRectangleContent,
                      moveEnded: (dx: number, dy: number) => {
                        moveEndedHandler(rectangle, dx, dy)
                        reFocusEl()
                        emits('update:editorArea', null)
                      },
                    }"

                    :style="{
                      height: `${rectangle.HEIGHT}px`,
                      width: `${rectangle.WIDTH}px`,
                      backgroundColor: rectangle.BACKGROUND_COLOR
                        ? rectangle.BACKGROUND_COLOR
                        : (rectangle.BACKGROUND_COLOR = 'transparent'),
                      border:
                        selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID
                          ? `calc(3px/var(--transform-scale) * var(--zoom-scale-ratio)) solid #F38F84`
                          : `calc(3px/var(--transform-scale) * var(--zoom-scale-ratio)) solid transparent`,
                      transform: `rotate(${rectangle.ROTATE_DEGREE}deg`,
                    }"
                    :class="{ 'box-shadow': isEditRectangleContent && isOverMaxContent && selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID }"
                    class="text-box-resize tw-select-none tw-flex tw-items-center tw-brectanglereak-words tw-box-content"
                    @click.stop="handleRecClick(rectangle)"
                    @mousedown="handleMovingArea"
                  >
                    <div
                      v-show="showOcrText"
                      :style="{
                        transformOrigin: 'right top',
                        transform: `scale(${1 / transformScale * zoomScaleRatio}) translate(${
                          -42 * transformScale / zoomScaleRatio
                        }px, -3px)`,
                        top: '0px',
                      }"
                      class="tw-absolute"
                    >
                      <img
                        v-if="rectangle.PREFIX_INDEX === TEXT_BOX_PREFIX_INDEX.IMPORT_EXCEL"
                        src="@/assets/icons/Rectangle_Green.svg"
                        class="!tw-max-w-none"
                        alt="index_checkbox"
                      >
                      <img
                        v-else-if="rectangle.PREFIX_INDEX === TEXT_BOX_PREFIX_INDEX.UPLOAD_PSD"
                        src="@/assets/icons/Rectangle_Blue.svg"
                        class="!tw-max-w-none"
                        alt="index_checkbox"
                      >
                      <img
                        v-else
                        src="@/assets/icons/Rectangle.svg"
                        class="!tw-max-w-none"
                        alt="index_checkbox"
                      >
                      <div
                        :style="{
                          transform: `translate(-50%, -50%) rotate(-${rectangle.ROTATE_DEGREE}deg`,
                        }"
                        class="original-text-box-index"
                      >
                        <div>
                          {{ getTextBoxIndex(rectangle, index as number) }}
                        </div>
                      </div>
                    </div>
                    <div
                      :id="`rectangle-${rectangle.ORIGINAL_TEXT_BOX_ID}`"
                      v-text-fit="{
                        enabled: !rectangle.FONT_SIZE,
                        rectangleWidth: rectangle.WIDTH, // support safari
                        fontUpdated: (newFontSize: number) =>
                          textFitHandler(rectangle, newFontSize),
                      }"

                      class="rectangle-container tw-z-50 tw-outline-0
                      tw-whitespace-pre-line tw-select-none
                      tw-w-full tw-h-full tw-flex tw-justify-center tw-flex-col
                       tw-break-words img-editor-tbx"
                      :placeholder="rectangle.PLACE_HOLDER"
                      :style="{
                        textAlign: rectangle.TEXT_ALIGN
                          ? rectangle.TEXT_ALIGN
                          : (rectangle.TEXT_ALIGN = 'center'),
                        fontSize: `${rectangle.FONT_SIZE} !important`,
                        fontFamily: rectangle.FONT_FAMILY ?? 'Arial',
                        color: rectangle.TEXT_COLOR
                          ? rectangle.TEXT_COLOR
                          : (rectangle.TEXT_COLOR = getContrastYIQ(
                            rectangle.VISION_BOX?.DOMINANT_COLOR,
                          )),
                        textShadow: rectangle.TEXT_SHADOW ?? '',
                        textUnderlineOffset: rectangle.TEXT_UNDERLINE_OFFSET,
                        textUnderlinePosition: 'under',
                      }"
                      @paste="checkPasteAsPlainText($event)"
                      @dblclick.stop="handleRectDblClick(rectangle)"
                    >
                      <div
                        :id="`rectangle-content-${rectangle.ORIGINAL_TEXT_BOX_ID}-${isTranslatedImages ? 'translated' : 'original'}`"
                        :contenteditable="
                          selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID
                            && isEditRectangleContent
                        "
                        class="rectangle-content"
                        @keydown.delete="deleteRectOnKeyDown(selectedOriginalId, { ...rectangle, TEXT: rectangle.TEXT })"
                        @keydown="handleKeyDown($event)"
                        v-html="rectangle.TEXT"
                      />
                    </div>
                  </div>
                  <translate-verify-box-content-card
                    v-bind="{ show: isEditRectangleContent && isOverMaxContent && selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID }"
                  />
                  <!--                  TEXT BOX NOTE -->
                  <div v-if="isTranslatedImages">
                    <translate-text-box-note
                      v-model:show-notes="showNotes"
                      v-model:note-text="rectangle.NOTE_TEXT"
                      :is-selected="selectedOriginalId === rectangle.ORIGINAL_TEXT_BOX_ID"
                      :is-over-max-content="isOverMaxContent"
                      :offset-x="noteOverImageWidthOffset(rectangle, imgNoteWidth)"
                      :text-box-id="rectangle.ORIGINAL_TEXT_BOX_ID"
                      :is-edit="isEditChapterMode"
                      :style=" { transform: `translateY(${handleOverImageHeight(rectangle)}) scale(calc(1/var(--transform-scale) * var(--zoom-scale-ratio))` }"
                      @paste="checkPasteAsPlainText($event)"
                      @keydown="handleKeyDown($event)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --transform-scale: 1;
  --center-offset: 0px;
}
.active-text-box {
  border: 4px solid #f38f84;
}

.resize-handle-container {
  position: relative;
}

.resize-handle {
  position: absolute;
  width: calc(10px/var(--transform-scale) * var(--zoom-scale-ratio));
  height: calc(10px/var(--transform-scale) * var(--zoom-scale-ratio));
  background-color: #FFFFFF;
  border-radius: 50%;
  border: calc(2px/var(--transform-scale) * var(--zoom-scale-ratio)) solid #F38F84;
  --negative-center-offset: calc(-6px/var(--transform-scale) * var(--zoom-scale-ratio));
  --center-offset: calc(5px/var(--transform-scale) * var(--zoom-scale-ratio));
}

.resize-handle-rotate {
  top: calc(17px/var(--transform-scale) * var(--zoom-scale-ratio));
  left: 50%;
  transform: translateX(-50%) translateY(calc(-50px/var(--transform-scale) * var(--zoom-scale-ratio)));
  z-index: 1;
  &:before{
    top: calc(7px/var(--transform-scale) * var(--zoom-scale-ratio));
    content: '';
    display: block;
    position: absolute;
    height:  calc(20px/var(--transform-scale) * var(--zoom-scale-ratio));
    left: 50%;
    width: calc(2px/var(--transform-scale) * var(--zoom-scale-ratio));
    border: calc(2px/var(--transform-scale) * var(--zoom-scale-ratio)) solid #F38F84;
    transform: translateX(-50%);
    background-color: #F38F84;
    z-index: -5;
  }
}

.resize-handle-te {
  top: 0;
  left: 50.5%;
}

.resize-handle-n {
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(var(--negative-center-offset));
}

.resize-handle-ne {
  position: absolute;
  top: calc(-1px/var(--transform-scale) * var(--zoom-scale-ratio));
  right: calc(-2px/var(--transform-scale) * var(--zoom-scale-ratio));
  cursor: ne-resize;
  transform: translateX(var(--center-offset)) translateY(var(--negative-center-offset));

}

.resize-handle-e {
  top: 50%;
  right: calc(-2px/var(--transform-scale) * var(--zoom-scale-ratio));
  transform: translateY(-50%) translateX(var(--center-offset));
  cursor: e-resize;
}

.resize-handle-se {
  bottom: calc(-1px/var(--transform-scale) * var(--zoom-scale-ratio));
  right: calc(-2px/var(--transform-scale) * var(--zoom-scale-ratio));
  cursor: se-resize;
  transform: translateX(var(--center-offset)) translateY(var(--center-offset));
}

.resize-handle-s {
  bottom: calc(-1px/var(--transform-scale) * var(--zoom-scale-ratio));
  left: 50.5%;
  transform: translateX(-50%) translateY(var(--center-offset));
  cursor: s-resize;
}

.resize-handle-sw {
  bottom: calc(-1px/var(--transform-scale) * var(--zoom-scale-ratio));
  left: calc(1px/var(--transform-scale) * var(--zoom-scale-ratio));
  cursor: sw-resize;
  transform: translateX(var(--negative-center-offset)) translateY(var(--center-offset));
}

.resize-handle-w {
  top: 50%;
  left: calc(1px/var(--transform-scale) * var(--zoom-scale-ratio));
  transform: translateY(-50%) translateX(var(--negative-center-offset));
  cursor: w-resize;
}

.resize-handle-nw {
  top: calc(-1px/var(--transform-scale) * var(--zoom-scale-ratio));
  left: calc(1px/var(--transform-scale) * var(--zoom-scale-ratio));
  cursor: nw-resize;
  transform: translateX(var(--negative-center-offset)) translateY(var(--negative-center-offset));
}

.original-text-box-index {
  border-radius: 50%;
  color: #000000 !important;
  border: 0px none rgb(128, 128, 128);
  background-color: #fbfbfb;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  width: 32px !important;
  height: 32px !important;
  left: 50%;
  font-size: 14px !important;
  font-weight: 500 !important;
  font-style: normal !important;
  transform: translate(-50%, -50%);
}

.iconRectangle {
  position: absolute;
  left: -40px;
  font-size: 14px;
  font-weight: 500;
  background-color: rgba(76, 104, 147, 0.52) !important;
  border-radius: 50%;
  border-top-right-radius: 0 !important;
  border: 4px solid transparent !important;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-text-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: calc(-27px/var(--transform-scale) * var(--zoom-scale-ratio));
  height: 28px;
  width: 28px;
}

[placeholder]:empty::before {
  content: attr(placeholder);
  color: #4D4D4D;
  font-weight: bold;
  text-shadow: none;
}

[placeholder]:empty:focus::before {
  content: "";
}

.img-editor-tbx {
  span, div, p {
    font-size: inherit !important;
  }

  outline: none;
}

.rectangle-content {
  width: inherit;
  outline: none;
}

.box-shadow {
  box-shadow: 0.93px 1.86px 15px 0 rgba(255, 106, 85, 0.5);
}
</style>
