import Axios, { AxiosRequestConfig } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'https://collectionapi.metmuseum.org',
})

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const nuxtApp = useNuxtApp()
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => {
      nuxtApp?.$swal.fire({
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
