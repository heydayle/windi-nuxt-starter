import { get, set } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

interface IEditor {
  id: string
  x: number
  y: number
  content: string
}
export const useMovingEditor = () => {
  const editorList = ref<IEditor[]>([
    {
      id: uuidv4(),
      x: 250,
      y: 150,
      content: '<p>Double click to edit</p>',
    },
    {
      id: uuidv4(),
      x: 250,
      y: 250,
      content: '<p>One click to resize</p>',
    },
    {
      id: uuidv4(),
      x: 0,
      y: 250,
      content: '<p>Click and hold to drag</p>',
    },
    {
      id: uuidv4(),
      x: 0,
      y: 150,
      content: '<p>Hello, I\'m Nuxt</p>',
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
    }
    get(editorList).push(newE)
  }
  const onRemoveEditor = (id: string) => {
    const newList = [...editorList.value.filter((e: IEditor) => e.id !== id)]
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
