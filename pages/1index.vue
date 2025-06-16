<template>
<div class="start">
    <h1>Start</h1>
    <!-- <button @click="goToCharging">Начать зарядку ⚡️</button> -->
    <!-- <a class="button" href="/battery-dance/">Почати ⚡️</a> -->
</div>
</template>

<script setup lang="ts">

const router = useRouter()
</script>

<style scoped>
.start {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100vh; background: #2c3e50; color: #ecf0f1;
}

.button {
    padding: 16px 32px; font-size: 1.2rem;
    border: none; border-radius: 8px;
    background: #e74c3c; color: white;
    cursor: pointer;
}
</style>