import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
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
    '@nuxtjs/tailwindcss',
    // svg icon
    'nuxt-svgo',
    // locales
    '@nuxtjs/i18n',
  ],
  i18n: {
    // langDir: '~/locales/',
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    detectBrowserLanguage: false,
  },
  components: [
    {
      prefix: 'Layout',
      path: resolve('./components/layouts'),
      global: true,
    },
    {
      prefix: 'Wind',
      path: resolve('./components/wind'),
      global: true,
    },
  ],
  imports: {
    dirs: [resolve('./stores'), '~/stores'],
  },
  css: [
    resolve('./assets/scss/_variables.scss'),
    resolve('./assets/scss/app.scss'),
  ],
  // module::pinia
  pinia: {
    storesDirs: ['~/stores/**', '#/stores/**', '@/stores/**'],
  },
  // svgo
  svgo: {
    componentPrefix: 'i',
    autoImportPath: './assets/icons/',
    global: true,
  },
})