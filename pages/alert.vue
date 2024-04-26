<script setup lang="ts">
import { useAlert } from '~/composables/alert'

const { error, warning, success, confirm } = useAlert()
const showSuccess = () => {
  success({
    text: 'This is success alert!',
  })
}
const showError = () => {
  error({
    text: 'This is error alert!',
  })
}
const showWarning = () => {
  warning({
    text: 'This is warning alert!',
  })
}
const showConfirm = () => {
  confirm({
    text: 'This is confirm alert?',
    actionConfirm: () => {
      showSuccess()
    },
    actionCancel: () => {
      showWarning()
    },
  })
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center">
      <div
        class="from-green-500 via-indigo-500 to-green-500 animate animate-text bg-gradient-to-r bg-clip-text text-transparent"
      >
        Alert modal
      </div>
      <div class="space-x-4 mb-6 mt-4">
        <UButton color="primary" @click="showSuccess">Success</UButton>
        <UButton color="red" @click="showError">Error</UButton>
        <UButton color="yellow" @click="showWarning">Warning</UButton>
        <UButton color="gray" @click="showConfirm">Confirm</UButton>
      </div>
    </div>
    <div class="h-[calc(100vh-200px)] overflow-auto">
      <ContentDoc tag="div" class="space-y-4" />
    </div>
  </div>
</template>
