<script setup lang="ts">
import { type IPopup, usePopupStore } from '~/stores/popup'
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

const { options, isShow } = storeToRefs(usePopupStore())
const model = computed<IPopup>(() => options.value)
const close = () => {
  isShow.value = false
}
</script>

<template>
  <div class="fixed">
    <HeadlessTransitionRoot appear :show="isShow" as="template">
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
          <div class="fixed inset-0 bg-black/25" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
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
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <HeadlessDialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  <Icon :name="ICONS[model.type]" :class="COLOR[model.type]" />
                  {{ model.title }}
                </HeadlessDialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ model.description }}
                  </p>
                </div>

                <div class="mt-4 text-right">
                  <UButton
                    variant="solid"
                    :class="COLOR[model.type]"
                    class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                    @click="close"
                  >
                    {{ model.confirmButton }}
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
