import { get, set } from '@vueuse/core'
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
  const editorList = ref<IEditor[]>([
    {
      id: uuidv4(),
      x: 290,
      y: 150,
      content: '<p>Double click to edit</p>',
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
    {
      id: uuidv4(),
      x: 290,
      y: 250,
      content: '<p>One click to resize</p>',
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
    {
      id: uuidv4(),
      x: 20,
      y: 250,
      content: '<p>Click and hold to drag</p>',
      draggable: true,
      resizable: false,
      rotatable: true,
      isFocused: false,
    },
    {
      id: uuidv4(),
      x: 20,
      y: 150,
      content: '<p>Hello, I\'m Nuxt</p>',
      draggable: false,
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
      x: getRandomInt(window.innerWidth - 600),
      y: getRandomInt(window.innerHeight - 70),
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
