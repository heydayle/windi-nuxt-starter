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
watch(() => route.query.id, (value, oldValue, onCleanup) => {
  if (value) {
    isShowForm.value = true
  }
}, { immediate: true })
</script>

<template>
  <div>
    Alert modal
    <div class="space-x-4">
      <UButton color="primary" @click="showSuccess">Success</UButton>
      <UButton color="red" @click="showError">Error</UButton>
      <UButton color="yellow" @click="showWarning">Warning</UButton>
    </div>
    Form modal
    <div>
      <UButton @click="isShowForm = !isShowForm">Open Form</UButton>
      <WindFormModal
        v-model="isShowForm"
        bg-opacity="xl"
        title="Register"
        @submit="() => {}"
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
