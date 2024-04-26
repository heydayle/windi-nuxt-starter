import { defineStore } from 'pinia'
export interface IModal {
  title: string
  description: string
  confirmButton: string
  type: 'success' | 'error' | 'warning'
  confirmAction?: (props?: any) => void
}
interface IModalOptions {
  title: string
  description: string
  confirmButton: string
  confirmAction?: (props?: any) => void
}

export const useModalStore = defineStore('modalStore', () => {
  const options = ref<IModal>({
    title: 'Title',
    description: 'Description',
    confirmButton: 'OK',
    type: 'success',
  })
  const isShow = ref(false)

  const showError = (popupOptions: IModalOptions) => {
    isShow.value = false
    setTimeout(() => {
      options.value = {
        ...popupOptions,
        type: 'error',
      }
      isShow.value = true
    }, 150)
  }
  const showSuccess = (popupOptions: IModalOptions) => {
    isShow.value = false
    setTimeout(() => {
      options.value = {
        ...popupOptions,
        type: 'success',
      }
      isShow.value = true
    }, 150)
  }
  const showWarning = (popupOptions: IModalOptions) => {
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
