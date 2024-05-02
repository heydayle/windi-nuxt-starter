---
Component: 'Dialog'
Description: 'Guide'
---

---
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

`components/Modal.vue`
```vue
<script setup lang="ts">
  
interface IProps {
  modelValue: boolean
  backdropOpacity?: 'sm' | 'lg' | 'xl'
  type?: 'free' | 'layout'
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  type: 'free',
  backdropOpacity: 'sm',
})

const BACKDROP_OPACITIES = {
  sm: 'bg-black/25',
  lg: 'bg-black/50',
  xl: 'bg-black/75',
}

</script>
```