// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // eslint
    // '@nuxtjs/eslint-module',
    // store
    '@pinia/nuxt',
    // ui
    '@nuxt/ui',
    'nuxt-windicss',
    // locales
    '@nuxtjs/i18n',
  ],
  i18n: {
    // langDir: '~/locales/',
    locales: ['en', 'vi'],
  },
})
