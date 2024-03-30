<script setup lang="ts">
// import WindIconWindNuxt from '~/assets/icons/wind-nuxt.svg'
const { winduxt } = useAppConfig()
const title = computed(() => winduxt.host)
</script>
<template>
  <div class="">
    <ULink to="/" class="block flex items-center">
      <i-logo filled class="text-[54px] mr-2" />
      <span class="text-primary">{{ title }}</span>
    </ULink>
  </div>
</template>
