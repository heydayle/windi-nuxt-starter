<script setup lang="ts">
const ICONS = {
  success: 'pajamas:status-closed',
  error: 'pajamas:status-alert',
  warning: 'ic:outline-warning',
}
const COLOR = {
  success: 'text-primary',
  error: 'text-red-500',
  warning: 'text-yellow-500',
}
const BG_OPACITIES = {
  'sm': 'bg-black/25',
  'lg': 'bg-black/50',
  'xl': 'bg-black/75',
}
interface IProps {
  modelValue?: boolean
  title?: string
  closeBtn?: boolean
  confirmBtn?: boolean
  cancelBtn?: boolean
  textConfirmBtn?: string
  textCancelBtn?: string
  bgOpacity?: 'sm' | 'lg' | 'xl'
}
interface IEmits {
  (e: 'update:modelValue'): void
  (e: 'submit'): void
  (e: 'cancel'): void
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  title: 'Form title',
  closeBtn: true,
  confirmBtn: true,
  textConfirmBtn: 'Submit',
  textCancelBtn: 'Cancel',
  bgOpacity: 'sm',
})
const emits = defineEmits<IEmits>()
const close = () => {
  emits('update:modelValue')
}
const submit = () => {
  emits('submit')
}
const cancel = () => {
  emits('cancel')
}
</script>

<template>
  <div class="fixed">
    <HeadlessTransitionRoot appear :show="modelValue" as="template">
      <HeadlessDialog as="div" class="relative z-10" @close="close">
        <HeadlessTransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0" :class="BG_OPACITIES[bgOpacity]" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center text-center"
          >
            <HeadlessTransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <HeadlessDialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-700 text-left align-middle shadow-xl transition-all"
              >
                <HeadlessDialogTitle
                  as="h3"
                  class="flex p-4 justify-between items-center text-lg font-medium leading-6 text-gray-100 border-b border-b-1 border-b-gray-500"
                >
                  <div>
                    {{ title }}
                  </div>
                  <div>
                    <UButton
                      class="rounded-full p-1"
                      variant="ghost"
                      icon="mdi:close"
                      color="gray"
                      :ui="{ rounded: 'rounded-full', padding: 'p-4' }"
                      @click="close"
                    ></UButton>
                  </div>
                </HeadlessDialogTitle>
                <div class="p-4">
                  <slot name="default" />
                </div>
                <div class="p-4 text-right space-x-2">
                  <UButton
                    variant="ghost"
                    class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                    @click="cancel"
                  >
                    {{ textCancelBtn }}
                  </UButton>
                  <UButton
                    variant="solid"
                    class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                    @click="submit"
                  >
                    {{ textConfirmBtn }}
                  </UButton>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </div>
</template>
