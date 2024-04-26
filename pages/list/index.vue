<script setup lang="ts">
import { useQuery } from 'vue-query'
import { getImage } from '~/api/modules/images'
const VUE_QUERY_HREF = 'https://vue-query.vercel.app/'
const API_URL = 'https://collectionapi.metmuseum.org/'
const ENDPOINT = {
  GET_LIST: 'public/collection/v1/objects',
  GET_DETAIL: 'public/collection/v1/objects',
}
const ENDPOINT_URL = API_URL + ENDPOINT.GET_LIST
const params = reactive({
  departmentIds: 3 | 9 | 12 | 15,
})
// const { data, pending: isLoading, execute: suspense } = useFetch(API_URL + ENDPOINT.GET_LIST, {
//   method: 'get',
//   query: {
//     departmentIds: params.departmentIds,
//   },
// })
const fetchData = async () => {
  return fetch(ENDPOINT_URL + '?departmentIds=' + params.departmentIds).then(
    (res) => res.json(),
  )
}
const { data, isLoading } = useQuery('getList', getImage)
// await suspense()
const collections = computed(() =>
  data?.value.objectIDs.filter((e, index) => index < 10),
)
const goDetail = (id: any) => {
  navigateTo('list/' + id)
}
</script>

<template>
  <div>
    <div class="py-4">
      Using
      <nuxt-link :to="VUE_QUERY_HREF" target="_blank" class="underline"
        >vue-query</nuxt-link
      >
      to fetch data
    </div>
    <div v-if="!isLoading" class="grid grid-cols-6 gap-4">
      <UButton
        v-for="(item, index) in collections"
        :key="index"
        color="primary"
        variant="ghost"
        class="text-center"
        @click="goDetail(item)"
      >
        image {{ item }}
      </UButton>
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<style scoped lang="scss"></style>
