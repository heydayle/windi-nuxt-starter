<script setup lang="ts">
import { useModalStore } from '~/stores/modal'

const modalStore = useModalStore()
const showSuccess = () => {
  modalStore.showSuccess({
    title: 'Success',
    description: 'This is success popup',
    confirmButton: 'OK',
  })
}
const showError = () => {
  modalStore.showError({
    title: 'Error',
    description: 'This is error popup',
    confirmButton: 'OK',
    confirmAction: () => {
      modalStore.showWarning({
        title: 'Warning',
        description: 'This is warning popup',
        confirmButton: 'OK',
      })
    },
  })
}
const showWarning = () => {
  modalStore.showWarning({
    title: 'Warning',
    description: 'This is warning popup',
    confirmButton: 'OK',
  })
}

const isShowForm = ref(false)
const route = useRoute()
watch(
  () => route.query.id,
  (value) => {
    if (value) {
      isShowForm.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
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
    </div>
    <div
      class="from-green-500 via-indigo-500 to-green-500 animate animate-text bg-gradient-to-r bg-clip-text text-transparent mb-4"
    >
      Form modal
    </div>
    <div>
      <UButton @click="isShowForm = !isShowForm">Open Form</UButton>
      <WindFormModal
        v-model="isShowForm"
        title="Register"
        backdrop-opacity="lg"
        background-color="primary"
        @submit="
          () => {
            showSuccess()
            isShowForm = !isShowForm
          }
        "
        @cancel="() => {}"
      >
        <div class="space-y-4">
          <div>
            <label>Name</label>
            <UInput placeholder="Devaloka Mes" />
          </div>
          <div>
            <label>Phone number</label>
            <UInput placeholder="0983313128" />
          </div>
          <div>
            <label>Email address</label>
            <UInput placeholder="yourmail@mail.com" />
          </div>
        </div>
      </WindFormModal>
    </div>
  </div>
</template>
