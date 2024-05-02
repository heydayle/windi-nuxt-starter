---
Title: 'Alert'
Description: 'Guide'
---

---
`component.vue`
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

`composable/alert.ts`
```ts
import { type SweetAlertOptions } from 'sweetalert2'
// https://github.com/sweetalert2/sweetalert2/blob/main/sweetalert2.d.ts

type IAlert = SweetAlertOptions & {
  title?: string
  text?: string
  confirmButtonText?: string
  actionConfirm?: () => void
  actionCancel?: () => void
  customClass: 'success' | 'error' | 'warning' | 'confirm'
}

return {
  success,
  error,
  warning,
  confirm,
  show // using this function to custom alert!
}
```

---
### Using without nuxt
`api/index.ts`
```ts
import Swal from 'sweetalert2'
import { SweetAlertOptions } from '~/plugins/sweetalert2.client' // default config swal

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => {
      Swal.fire({
        ...SweetAlertOptions,
        title: 'Api title alert',
        customClass: 'success',
      })
      return data
    },
  )

  return promise
}
```