import type { VueQueryPluginOptions } from 'vue-query'
import { VueQueryPlugin, QueryClient } from 'vue-query'


export default defineNuxtPlugin((nuxt) => {
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  })
  const options: VueQueryPluginOptions = { queryClient }

  nuxt.vueApp.use(VueQueryPlugin, options)
  // const vueQueryClient = useState<DehydratedState | null>('vue-query')

  // // @ts-expect-error Nuxt process variable
  // if (process.server) {
  //   nuxt.hooks.hook('app:rendered', () => {
  //     vueQueryClient.value = dehydrate(queryClient)
  //   })
  // }
  //
  // // @ts-expect-error Nuxt process variable
  // if (process.client) {
  //   nuxt.hooks.hook('app:created', () => {
  //     hydrate(queryClient, vueQueryClient.value)
  //   })
  // }
})
