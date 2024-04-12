<script setup lang="ts">
const USE_FETCH_HREF = 'https://nuxt.com/docs/api/composables/use-fetch'
const API_URL = 'https://collectionapi.metmuseum.org/'
const ENDPOINT = {
  GET_LIST: 'public/collection/v1/objects',
  GET_DETAIL: 'public/collection/v1/objects',
}
const route = useRoute()
const { data: detailData, pending: detailPending } = useFetch(
  API_URL + ENDPOINT.GET_DETAIL + '/' + route.params?.id,
  {
    method: 'get',
  },
)
const detail = computed(() => detailData.value)
const detailLoading = computed(() => detailPending.value)
</script>

<template>
  <div>
    <div class="py-4">
      Using
      <nuxt-link :to="USE_FETCH_HREF" target="_blank" class="underline">
        useFetch
      </nuxt-link>
      to fetch data
    </div>
    <div v-if="detail && !detailLoading">
      <img :src="detail.primaryImageSmall" />
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<style scoped lang="scss"></style>
