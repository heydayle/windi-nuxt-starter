<script setup lang="ts">
import { useQuery } from 'vue-query'
const VUE_QUERY_HREF = 'https://vue-query.vercel.app/#/getting-started'
const API_URL = 'https://collectionapi.metmuseum.org/'
const ENDPOINT = {
  GET_LIST: 'public/collection/v1/objects',
  GET_DETAIL: 'public/collection/v1/objects',
}
const params = reactive({
  departmentIds: 3 | 9 | 12 | 15,
})
// const { data, pending, execute } = useFetch(API_URL + ENDPOINT.GET_LIST, {
//   method: 'get',
//   query: {
//     departmentIds: params.departmentIds,
//   },
// })
const ENDPOINT_URL = API_URL + ENDPOINT.GET_LIST
const fetchData = async () => {
  return fetch(ENDPOINT_URL + '?departmentIds=' + params.departmentIds).then(
    (res) => res.json(),
  )
}
const { data, suspense, isLoading } = useQuery('getList', fetchData)
await suspense()
const collections = computed(() => data?.value)
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
        v-for="(item, index) in collections.objectIDs"
        :key="index"
        color="black"
        variant="outline"
        @click="goDetail(item)"
      >
        image {{ item }}
      </UButton>
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<style scoped lang="scss"></style>
