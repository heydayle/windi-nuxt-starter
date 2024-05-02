import Swal from 'sweetalert2'
import type { VueAppInstance } from '@vue/devtools-kit'
import 'sweetalert2/dist/sweetalert2.css'

export const SweetAlertOptions = {
  reverseButtons: true,
  confirmButtonColor: '#00C16A',
  cancelButtonColor: 'transparent',
  title: 'Alert',
  text: 'Content message',
  customClass: 'yc-alert',
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  showCancelButton: false,
  imageUrl: '/icons/success.svg',
}
const $swal = {
  install: (Vue: VueAppInstance, options: any) => {
    Vue.provide('Swal', Swal.mixin(options))
  },
}
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use($swal, SweetAlertOptions)
})
