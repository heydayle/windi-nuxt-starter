<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
const BACKDROP_OPACITIES = {
  sm: 'bg-black/25',
  lg: 'bg-black/50',
  xl: 'bg-black/75',
}
interface IProps {
  modelValue: boolean
  clickOutsideToClose: boolean
  backdropOpacity?: 'sm' | 'lg' | 'xl'
  type?: 'free' | 'layout'
}
interface IEmits {
  (e: 'update:modelValue'): void
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  clickOutsideToClose: true,
  type: 'free',
  backdropOpacity: 'sm',
})
const emits = defineEmits<IEmits>()
const close = () => {
  props.clickOutsideToClose && emits('update:modelValue')
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
          <div
            class="fixed inset-0"
            :class="BACKDROP_OPACITIES[backdropOpacity]"
          />
        </HeadlessTransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center text-center">
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
                class="transform overflow-hidden rounded-2xl align-middle shadow-xl transition-all"
                v-bind="{
                  ...$attrs,
                }"
              >
                <template v-if="type === 'free'">
                  <slot name="default" />
                </template>
                <template v-else>
                  <HeadlessDialogTitle as="h3">
                    <slot name="title" />
                  </HeadlessDialogTitle>
                  <slot name="default" />
                  <slot name="action" />
                </template>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </div>
</template>
