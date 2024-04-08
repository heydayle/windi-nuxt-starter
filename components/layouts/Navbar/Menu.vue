<script setup lang="ts">
const localePath = useLocalePath()
const { winduxt } = useAppConfig()
const menus = computed(() => winduxt.layout.header.navbar.menus)
</script>
<template>
  <div class="flex items-center space-x-4">
    <ULink
      v-for="(item, index) in menus"
      :key="index"
      :to="localePath(item.to.path)"
      active-class="text-primary"
      class="block uppercase"
    >
      {{ item.title }}
    </ULink>
  </div>
</template>
