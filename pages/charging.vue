<template>
  <div class="charging" @click.once="initAudio">
    <div class="bars">
      <div
        v-for="(v, i) in bars"
        :key="i"
        class="bar"
        :style="{ transform: `scaleY(${v})` }"
      />
    </div>

    <div class="battery-wrap">
      <Battery3D :percent="percent" />
    </div>

      <div class="gradient-bg">
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
    <div class="gradients-container">
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
      <div class="interactive"></div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { Howl, Howler }        from 'howler'
import Battery3D               from '~/components/Battery3D.vue'

/* ─────────── 1. константы ─────────── */
const DURATION = 170_000        // 2 мин 50 с  → в миллисекундах
const howl = new Howl({ src: ['/battery-dance/music.mp3'], loop: true, volume: 0.8, html5: true })
 
/* ─────────── 2. реактивность ───────── */
const percent = ref(0)
const FFT = 32
const bars = ref<number[]>(Array(FFT).fill(0.2))
let nextBarUpdate = 0 

let analyser: AnalyserNode | null = null
let data: Uint8Array

/* ─────────── 3. клик - запуск ───────── */
function initAudio () {
  const ctx = new AudioContext()
  ctx.resume().then(() => {
    const src = ctx.createMediaElementSource(howl._sounds[0]._node as HTMLMediaElement)
    analyser = ctx.createAnalyser()
    analyser.fftSize = FFT * 2
    data = new Uint8Array(analyser.frequencyBinCount)
    src.connect(analyser)
    analyser.connect(ctx.destination)

    howl.once('unlock', () => {
      howl.play()
      startLoops()
      setTimeout(() => howl.stop(), DURATION)          // ① вырубить музыку
    })
  })
}

/* ─────────── 4. главный цикл ───────── */
function startLoops () {
  const t0 = performance.now()

  // «ломаная» кривая: два “проседа” на 10 %
  const curve = (t: number) => {              // t ∈ [0, 1]
    if (t < 0.35)          return t / 0.35 * 35
    if (t < 0.40)          return 35 - (t - 0.35) / 0.05 * 10   // ↓ до 25 %
    if (t < 0.60)          return 25 + (t - 0.40) / 0.20 * 35   // ↑ до 60 %
    if (t < 0.65)          return 60 - (t - 0.60) / 0.05 * 10   // ↓ до 50 %
    /* финальный подъём до 100 % */
    return 50 + (t - 0.65) / 0.35 * 50
  }

  ;(function frame () {
    const now = performance.now()
    const t   = Math.min((now - t0) / DURATION, 1)   // нормализуем 0-1
    percent.value = Math.round(curve(t))

    if (analyser && now > nextBarUpdate) {
      nextBarUpdate = now + 83
      analyser.getByteFrequencyData(data)
      bars.value = data.map(v => (v / 256) * 4 + 0.2)
    }

    if (t < 1) requestAnimationFrame(frame)          // ② останавливаемся ровно на 170 c
  })()
}

/* ─────────── 5. очистка ───────── */
onBeforeUnmount(() => {
  howl.stop()
  Howler.unload()
})
</script>

<style lang="scss">
.charging {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at bottom, rgba(255, 255, 255, 0.35) 0%, transparent 70%),
    linear-gradient(
      135deg,
      #8ec5fc 0%,
      #e0c3fc 25%,
      #f093fb 50%,
      #f5576c 75%,
      #4facfe 100%
    );
  background-size: 400% 400%;
  animation: bgShift 18s linear infinite;
}

.bars {
  position: absolute;
  bottom: 160px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  height: 140px;
  pointer-events: none;
  z-index: 10000;
}

.bar {
  width: 14px;
  transform-origin: bottom;
  border-radius: 2px 2px 0 0;
  background: linear-gradient(180deg, #ef6ecf 0%, #b36fbc 100%);
  transition: transform 0.09s linear;
  box-shadow: 0 0 6px rgba(255, 3, 188, 0.731);
}

.battery-wrap {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 480px;
  z-index: 10000;
}

html,
body {
  font-family: 'Dongle', sans-serif;
  margin: 0;
  padding: 0;
}

.text-container {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  font-size: 96px;
  color: white;
  opacity: 0.8;
  user-select: none;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.1);
}

:root {
  --color-bg1: rgb(108, 0, 162);
  --color-bg2: rgb(0, 17, 82);
  --color1: 18, 113, 255;
  --color2: 221, 74, 255;
  --color3: 100, 220, 255;
  --color4: 200, 50, 50;
  --color5: 180, 180, 50;
  --color-interactive: 140, 100, 255;
  --circle-size: 80%;
  --blending: hard-light;
}

@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

.gradient-bg {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
  top: 0;
  left: 0;

  svg {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }

  .gradients-container {
    filter: url(#goo) blur(40px);
    width: 100%;
    height: 100%;
  }

  .g1 {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(var(--color1), 0.8) 0,
      rgba(var(--color1), 0) 50%
    )
      no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: center center;
    animation: moveVertical 30s ease infinite;
    opacity: 1;
  }

  .g2 {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(var(--color2), 0.8) 0,
      rgba(var(--color2), 0) 50%
    )
      no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;
    opacity: 1;
  }

  .g3 {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(var(--color3), 0.8) 0,
      rgba(var(--color3), 0) 50%
    )
      no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2 + 200px);
    left: calc(50% - var(--circle-size) / 2 - 500px);
    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;
    opacity: 1;
  }

  .g4 {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(var(--color4), 0.8) 0,
      rgba(var(--color4), 0) 50%
    )
      no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;
    opacity: 0.7;
  }

  .g5 {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(var(--color5), 0.8) 0,
      rgba(var(--color5), 0) 50%
    )
      no-repeat;
    mix-blend-mode: var(--blending);
    width: calc(var(--circle-size) * 2);
    height: calc(var(--circle-size) * 2);
    top: calc(50% - var(--circle-size));
    left: calc(50% - var(--circle-size));
    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;
    opacity: 1;
  }

  .interactive {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(var(--color-interactive), 0.8) 0,
      rgba(var(--color-interactive), 0) 50%
    )
      no-repeat;
    mix-blend-mode: var(--blending);
    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;
    opacity: 0.7;
  }
}
</style>