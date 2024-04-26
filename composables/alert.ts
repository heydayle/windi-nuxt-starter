import { SweetAlertOptions } from 'sweetalert2'
interface IAlert {
  title?: string
  text?: string
  confirmButtonText?: string
  actionConfirm?: () => void
  actionCancel?: () => void
}
interface ISweetAlert {
  fire: (options: SweetAlertOptions, attr1?: any, attr2?: any) => any
}
export const useAlert = () => {
  const alert = inject<ISweetAlert>('Swal') as ISweetAlert
  const show = (options?: IAlert) => {
    alert.fire({
      title: options?.title || 'Alert',
      text: options?.text || 'text',
      confirmButtonText: options?.confirmButtonText || 'OK',
    })
  }
  const showError = (options?: IAlert) => {
    alert.fire({
      title: options?.title || 'Error',
      text: options?.text || 'text',
      confirmButtonText: options?.confirmButtonText || 'OK',
      customClass: 'error',
      imageUrl: '/icons/error.svg',
    })
  }
  const showWarning = (options?: IAlert) => {
    alert.fire({
      title: options?.title || 'Warning',
      text: options?.text || 'text',
      confirmButtonText: options?.confirmButtonText || 'OK',
      customClass: 'warning',
      imageUrl: '/icons/warning.svg',
    })
  }
  const showSuccess = (options?: IAlert) => {
    alert.fire({
      title: options?.title || 'Success',
      text: options?.text || 'text',
      confirmButtonText: options?.confirmButtonText || 'OK',
      customClass: 'success',
      imageUrl: '/icons/success.svg',
    })
  }
  const showConfirm = (options?: IAlert) => {
    alert
      .fire({
        title: options?.title || 'Confirm',
        text: options?.text || 'text',
        confirmButtonText: options?.confirmButtonText || 'OK',
        customClass: 'confirm',
        showCancelButton: true,
        imageUrl: '/icons/question.svg',
      })
      .then((result: any) => {
        if (result.isConfirmed && options?.actionConfirm) {
          options.actionConfirm()
        } else if (options?.actionCancel) {
          options?.actionCancel()
        }
      })
  }
  return {
    alert,
    show,
    error: showError,
    warning: showWarning,
    success: showSuccess,
    confirm: showConfirm,
  }
}
