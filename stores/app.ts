import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
  // other options...
  const loading = ref<boolean>()

  return {
    loading,
  }
})
