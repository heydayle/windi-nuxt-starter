---
Title: 'Alert'
Description: 'Usage'
---

---

`composables/alert.ts`
```ts
import { type SweetAlertOptions } from 'sweetalert2'
// https://github.com/sweetalert2/sweetalert2/blob/main/sweetalert2.d.ts

type IAlert = SweetAlertOptions & {
  title: string
  message?: string
  confirmButtonText?: string
  actionConfirm?: () => void
  actionCancel?: () => void
  customClass: 'success' | 'error' | 'warning' | 'confirm' | string
}

```
## Functions
| Functions   | Description                                                                                             |
|:------------|:--------------------------------------------------------------------------------------------------------|
| `success()` | Default style alert success with your `message` & `title`                                               |
| `error()`   | Default style alert error with your `message` & `title`                                                 |
| `warning()` | Default style alert warning with your `message` & `title`                                               |
| `confirm()` | Default style alert confirm with your `message` & `title` and set `action` when click confirm or cancel |
| `show()`    | Using this function to custom alert!                                                                    |
## Parameters
| Parameter           | Type                                       | Default                |
|:--------------------|:-------------------------------------------|:-----------------------|
| `title`             | string                                     | 'Alert'                |
| `message`           | string                                     | 'Content message'      |
| `confirmButtonText` | string                                     | 'OK'                   |
| `actionConfirm`     | void                                       | undefined              |
| `actionCancel`      | void                                       | undefined              |
| `customClass`       | success, error, warning, confirm or string | 'yc-alert'             |
| `imageUrl`          | string                                     | '/icons/success.svg'   |

More parameters in [here](https://github.com/sweetalert2/sweetalert2/blob/main/sweetalert2.d.ts)!

---
## Usage
### In pages | components
`component.vue`
```vue
<script setup lang="ts">
  
 // get success() from useAlert composable
 const { success } = useAlert()

 const showSuccess = () => {
  // call success with options
  success({
    message: 'This is success alert!',
  })
 }
</script>

<template>
    <UButton @click="showSuccess">Success</UButton>
</template>
```

### Without nuxt
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
        title: 'Api success alert',
        customClass: 'Call success',
      })
      
      return data
    },
  )

  return promise
}
```