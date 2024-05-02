<script setup lang="ts">
import { useAlert } from '~/composables/alert'

const { error, warning, success, confirm } = useAlert()
const showSuccess = () => {
  success({
    message: 'This is success alert!',
  })
}
const showError = () => {
  error({
    message: 'This is error alert!',
  })
}
const showWarning = () => {
  warning({
    message: 'This is warning alert!',
  })
}
const showConfirm = () => {
  confirm({
    message: 'This is confirm alert?',
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
    <div class="text-center">
      <UButton
        variant="link"
        to="https://github.com/heydayle/windi-nuxt-starter/blob/main/content/alert.md"
        target="_blank"
        >Check document here!
        <template #trailing>
          <UIcon name="iconamoon:link-external-fill" class="w-5 h-5" />
        </template>
      </UButton>
    </div>
  </div>
</template>
