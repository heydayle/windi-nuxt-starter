import Axios, { AxiosRequestConfig } from 'axios'
import Swal from 'sweetalert2'
import { SweetAlertOptions } from '~/plugins/sweetalert2.client'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'https://collectionapi.metmuseum.org',
})

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  // const nuxtApp = useNuxtApp()
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => {
      Swal.fire({
        ...SweetAlertOptions,
        title: 'Success',
      })
      return data
    },
  )

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by Vue Query')
  }

  return promise
}

export default customInstance
