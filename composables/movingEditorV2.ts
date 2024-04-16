import { get, set, useElementSize } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

interface IEditor {
  id: string
  x: number
  y: number
  content: string
  draggable?: boolean
  resizable?: boolean
  rotatable?: boolean
  isFocused?: boolean
}
export const useMovingEditorV2 = () => {
  const area = ref<HTMLElement | null>(null)
  onMounted(() => {
    area.value = document.querySelector('.area')
  })
  const { width } = useElementSize(area)
  const editorList = ref<IEditor[]>([
    {
      id: uuidv4(),
      x: 760,
      y: 50,
      content: '<p>Hello, I am Nuxt</p>',
      draggable: false,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
    {
      id: uuidv4(),
      x: 1030,
      y: 50,
      content: '<p>Double click to edit</p>',
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
    {
      id: uuidv4(),
      x: 760,
      y: 145,
      content: '<p>One click to resize</p>',
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
    {
      id: uuidv4(),
      x: 1030,
      y: 145,
      content: '<p>Click and hold to drag</p>',
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
  ])
  const getRandomInt = (max: number = 1) => {
    return Math.floor(Math.random() * max)
  }
  const createEditor = () => {
    const position = {
      x: getRandomInt(width.value),
      y: getRandomInt(width.value),
    }
    const newE = {
      ...position,
      id: uuidv4(),
      content: 'x: ' + position.x + ', y: ' + position.y,
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    }
    get(editorList).push(newE)
  }
  const onRemoveEditor = (index: number) => {
    const newList = [...editorList.value].filter((e, idx) => idx !== index)
    set(editorList, [])
    setTimeout(() => {
      set(editorList, newList)
    })
  }
  const onClear = () => {
    set(editorList, [])
  }
  return {
    editorList,
    createEditor,
    onRemoveEditor,
    onClear,
  }
}
