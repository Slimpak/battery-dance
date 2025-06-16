export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
    modules: [
    '@tresjs/nuxt'
  ],
  typescript: {
    strict: true
  },
  nitro: {
    prerender: {
      routes: ['/', '/charging']
    }
  }
})