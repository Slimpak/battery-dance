export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
    modules: [
    '@tresjs/nuxt'
  ],
  app: { baseURL: '/battery-dance/' },
  typescript: {
    strict: true
  },
  nitro: {
    prerender: {
      routes: ['/', '/charging']
    }
  }
})