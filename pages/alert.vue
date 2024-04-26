<script setup lang="ts">
import { useAlert } from '~/composables/alert'

const { error, warning, success, confirm } = useAlert()
const nuxtApp = useNuxtApp()
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
  // $swal.fire({
  //   text: 'This is warning alert!',
  // })
  nuxtApp.$swal.fire({
    text: 'This is warning alert!',
  })
  // warning({
  //   text: 'This is warning alert!',
  // })
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

const isShowForm = ref(false)
const isShowDialog = ref(false)
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
      <UButton color="gray" @click="showConfirm">Confirm</UButton>
    </div>
    <div
      class="from-green-500 via-indigo-500 to-green-500 animate animate-text bg-gradient-to-r bg-clip-text text-transparent mb-4"
    >
      Form modal
    </div>
    <div class="flex space-x-4">
      <div>
        <UButton variant="outline" @click="isShowForm = !isShowForm"
          >Open Layout Modal</UButton
        >
        <WindModal
          v-model="isShowForm"
          type="layout"
          backdrop-opacity="lg"
          class="bg-gray-900 w-full max-w-md text-left"
        >
          <template #title>
            <div
              class="flex p-4 justify-between items-center text-lg font-medium leading-6 text-gray-100 border-b border-b-1 border-b-gray-500"
            >
              <div>Title</div>
              <div>
                <UButton
                  class="rounded-full p-1"
                  variant="ghost"
                  icon="mdi:close"
                  color="gray"
                  :ui="{ rounded: 'rounded-full', padding: 'p-4' }"
                  @click="isShowForm = !isShowForm"
                ></UButton>
              </div>
            </div>
          </template>
          <template #action>
            <div
              class="p-4 text-right space-x-2 border-t border-t-1 border-t-gray-500"
            >
              <UButton
                variant="ghost"
                class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                @click="isShowForm = !isShowForm"
              >
                Cancel
              </UButton>
              <UButton
                variant="solid"
                class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                @click="isShowForm = !isShowForm"
              >
                Confirm
              </UButton>
            </div>
          </template>
          <div class="p-4 space-y-4">
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
        </WindModal>
      </div>
      <div>
        <UButton @click="isShowDialog = !isShowDialog">Open Free Modal</UButton>
        <WindModal
          v-model="isShowDialog"
          type="free"
          backdrop-opacity="lg"
          class="bg-gray-900 w-1/2 m-4 text-left"
        >
          <div class="p-4">
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
            <div class="mt-4 text-right">
              <UButton @click="isShowDialog = !isShowDialog">Submit</UButton>
            </div>
          </div>
        </WindModal>
      </div>
    </div>
  </div>
</template>
