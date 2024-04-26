import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  routeRules: {
    '/moving-v2': { prerender: true },
    '/list': { prerender: true },
    '/list/**': { prerender: true },
  },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    'nuxt-svgo',
    '@nuxtjs/i18n',
    'nuxt-tiptap-editor',
    '@nuxt/content',
    // https://tiptap.dev/docs/editor/api/extensions/invisible-characters
    // https://tiptap.dev/docs/editor/api/extensions/text-align
    // https://vue3datepicker.com/props/modes/
  ],
  tiptap: {
    prefix: 'Tiptap',
  },
  headlessui: {
    prefix: 'Headless',
  },
  i18n: {
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
