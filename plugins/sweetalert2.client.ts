import Swal from 'sweetalert2'
import type { VueAppInstance } from '@vue/devtools-kit'
import 'sweetalert2/dist/sweetalert2.css'

const options = {
  reverseButtons: true,
  confirmButtonColor: '#00C16A',
  cancelButtonColor: 'transparent',
  title: 'Success',
  text: 'Content text',
  customClass: 'yc-alert',
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  // buttonsStyling: false,
  showCancelButton: false,
  imageUrl: '/icons/success.svg',
}
const $swal = {
  install: (Vue: VueAppInstance, options: any) => {
    Vue.provide('Swal', Swal.mixin(options))
  },
}
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('swal', Swal.mixin(options))
  nuxtApp.vueApp.use($swal, options)
})
