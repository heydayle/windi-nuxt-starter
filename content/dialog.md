---
Component: 'Dialog'
Description: 'Guide'
---

---
## Props
| Props             | Type             | Default |
|:------------------|:-----------------|:--------|
| `v-model`         | boolean          | false   |
| `backdropOpacity` | 'sm', 'lg', 'xl' | 'sm'    |
| `type`            | 'free', 'layout' | 'free'  |
---
# Usage
`component.vue`
```vue
<script setup lang="ts">
  
const isShowFree = ref(false)
const isShowLayout = ref(false)
const isShowCustomStyle = ref(false)
  
</script>
  
<template>
  <div>
      // Free styling modal
      <Modal v-model="isShowFree">
        content
      </Modal>
      
      // Layout modal
      <Modal
        v-model="isShowLayout"
        type="layout"
      >
        <template #title />
        <template #default />
        <template #action />
      </Modal>
  </div>
</template>
```
---

Custom background and style for modal
```vue
<template>
  <div>
      <Modal
        v-model="isShowCustomStyle"
        class="bg-gray-900 custom-class"
      >
        <div class="title"></div>
        <div class="content"></div>
        <div class="action"></div>
      </Modal>
  </div>
</template>

<stlye lang="scss">
  .custom-class {
    padding: 1rem
    .title {
      // your style  
    }
    ...
  }
</stlye>
```