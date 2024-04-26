<script setup lang="ts">
useSeoMeta({
  title: 'Moving editor',
})
definePageMeta({ layout: 'area' })

const areaA = ref(null)
const areaB = ref(null)
const onClickOutArea = (options: { isA: boolean }) => {
  if (options.isA) areaB.value?.onClickOutside()
  else areaA.value?.onClickOutside()
}
</script>
<template>
  <div class="flex space-x-4">
    <WindArea ref="areaA" :is-a="true" @click-out-area="onClickOutArea" />
    <WindArea ref="areaB" @click-out-area="onClickOutArea" />
  </div>
</template>
