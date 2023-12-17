import { type ToastServiceMethods } from 'primevue/toastservice'

export const customToast = {
  success(toast: ToastServiceMethods, msg: string) {
    toast.add({
      detail: msg,
      severity: 'success',
      life: 3000,
      closable: true
    })
  },
  warning(toast: ToastServiceMethods, msg: string) {
    toast.add({
      detail: msg,
      severity: 'warn',
      life: 3000,
      closable: true
    })
  }
}
