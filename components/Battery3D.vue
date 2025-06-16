<script setup lang="ts">
import { computed } from 'vue'

/**
 * Компонент‑«батарейка»
 * ───────────────────────────────────────────────
 * Использование:
 * <Battery :percent="42" />  // число 0‑100
 */

const props = defineProps<{
  /** уровень заряда 0‑100 */
  percent: number
  /** ширина в px, %, rem — как угодно (по умолчанию 360px) */
  width?: string | number
  /** высота в px, %, rem — как угодно (по умолчанию 780px) */
  height?: string | number
}>()

/* style вычисляется реактивно, чтобы не трогать DOM, если число не меняется */
const chargeStyle = computed(() => ({
  height: `${Math.min(Math.max(props.percent, 0), 100)}%`
}))

const wrapperStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || '260px',
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || '480px'
}))
</script>

<template>
  <div class="battery" :style="wrapperStyle">
    <div class="charge" :style="chargeStyle"></div>
    <div class="glass"></div>
    <div class="emodj-energy">⚡</div>
    <div class="percent">{{ Math.round(props.percent) }}%</div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background: #2c3e50;
  color: #ecf0f1;
  font-family: Arial, sans-serif;
}

.battery {
  position: relative;
  /* размеры передаются через style */
  transform: perspective(600px) rotateX(6deg);
  background: linear-gradient(90deg, #4b3bff, #8c78ff);
  user-select: none;
}
.battery::before {
  content: "";
  position: absolute;
  top: -9%; /* пропорционально высоте */
  left: 50%;
  transform: translateX(-50%);
  width: 66.666%; /* 240/360 */
  height: 9.23%;  /* 72/780 */
  background: linear-gradient(90deg, #d4d1ff, #f0edff);
  border-radius: 36px 36px 18px 18px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}
.battery::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 60%
  );
  pointer-events: none;
}

/* заряд */
.charge {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(0deg, #00ff88, #00d4ff);
  box-shadow: 0 -12px 24px rgba(0, 255, 136, 0.4);
  transition: height 0.25s linear;
}

/* блик */
.glass {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 60%
  );
  pointer-events: none;
}

/* emoji */
.emodj-energy {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 6rem;
  color: #fff;
  animation: pulse 1.2s infinite alternate;
  pointer-events: none;
}
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    text-shadow: 0 0 12px #fff8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.18);
    text-shadow: 0 0 32px #fff;
  }
}

/* проценты */
.percent {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6%; /* пропорционально */
  font-size: 4.2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}
</style>
