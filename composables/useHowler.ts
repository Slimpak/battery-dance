// composables/useHowler.ts
import { Howl, HowlOptions } from 'howler'

// сохраняем экземпляр в модуле — он общий для всех подключений
let singleton: Howl | null = null

export function useHowler(opts: HowlOptions) {
  if (!singleton) {
    singleton = new Howl({
      html5: true,        // браузерное аудио
      preload: true,      // заранее буферизуем
      pool: 1,            // 👉 не создаём запас из 5 аудиотегов
      ...opts
    })
  }
  const play  = () => singleton!.play()
  const pause = () => singleton!.pause()
  return { sound: singleton!, play, pause }
}
