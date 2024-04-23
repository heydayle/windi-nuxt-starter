import { defineStore } from 'pinia'
export interface IPopup {
  title: string
  description: string
  confirmButton: string
  type: 'success' | 'error' | 'warning'
  confirmFunction?: void
  cancelAction?: void
}
interface IPopupOptions {
  title: string
  description: string
  confirmButton: string
  confirmFunction?: void
  cancelAction?: void
}

export const usePopupStore = defineStore('popupStore', () => {
  // other options...
  const options = ref<IPopup>({
    title: 'Title',
    description: 'Description',
    confirmButton: 'OK',
    type: 'success',
  })
  const isShow = ref(false)

  const showError = (popupOptions: IPopupOptions) => {
    isShow.value = false
    setTimeout(() => {
      options.value = {
        ...popupOptions,
        type: 'error',
      }
      isShow.value = true
    }, 150)
  }
  const showSuccess = (popupOptions: IPopupOptions) => {
    isShow.value = false
    setTimeout(() => {
      options.value = {
        ...popupOptions,
        type: 'success',
      }
      isShow.value = true
    }, 150)
  }
  const showWarning = (popupOptions: IPopupOptions) => {
    isShow.value = false
    setTimeout(() => {
      options.value = {
        ...popupOptions,
        type: 'warning',
      }
      isShow.value = true
    }, 150)
  }

  return {
    isShow,
    options,
    showError,
    showSuccess,
    showWarning,
  }
})
