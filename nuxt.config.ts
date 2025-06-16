export default defineNuxtConfig({
  // GitHub Pages раздаёт только статику
  ssr: false,

  /**
   * baseURL можно задать через переменную окружения.
   * Локально она будет просто «/», в CI — «/battery-dance/».
   */
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },

  nitro: {
    // перечислите все SPA-маршруты, которые должны быть в статике
    prerender: { routes: ['/', '/1index'] }
  }
})
