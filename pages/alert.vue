<script setup lang="ts">
import { usePopupStore } from '~/stores/popup'

const isShowDialog = ref(false)
const popupStore = usePopupStore()
const { options, isShow } = storeToRefs(usePopupStore())
const showSuccess = () => {
  popupStore.showSuccess({
    title: 'Success',
    description: 'This is success popup',
    confirmButton: 'OK',
  })
}
const showError = () => {
  popupStore.showError({
    title: 'Error',
    description: 'This is error popup',
    confirmButton: 'OK',
  })
  setTimeout(() => showWarning(), 300)
}
const showWarning = () => {
  popupStore.showWarning({
    title: 'Warning',
    description: 'This is warning popup',
    confirmButton: 'OK',
  })
}
</script>

<template>
  <div class="space-x-4">
    <UButton color="primary" @click="showSuccess">Success</UButton>
    <UButton color="red" @click="showError">Error</UButton>
    <UButton color="yellow" @click="showWarning">Warning</UButton>
  </div>
</template>
