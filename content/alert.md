---
title: 'Alert'
description: 'Document for app alert'
---

# <div class="text-left text-2xl font-bold">Alert</div>

---
component.vue
```ts
const { success } = useAlert()
// useAlert is a composable

const showSuccess = () => {
  success({
    text: 'This is success alert!',
  })
}
```
```html
<template>
    <UButton @click="showSuccess">Success</UButton>
</template>
```
---

alert.ts
```ts
import { type SweetAlertOptions } from 'sweetalert2'
// https://github.com/sweetalert2/sweetalert2/blob/main/sweetalert2.d.ts

type IAlert = SweetAlertOptions & {
  title?: string
  text?: string
  confirmButtonText?: string
  actionConfirm?: () => void
  actionCancel?: () => void
}
// composable setup
```