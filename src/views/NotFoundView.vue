<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-6">Página não encontrada</h2>
    <p class="text-text-secondary max-w-md mb-8">
      A página que você está procurando não existe ou foi removida.
    </p>
    <div class="space-y-4">
      <router-link to="/" class="btn-primary block">
        Voltar para o Início
      </router-link>
      <button @click="goBack" class="btn-secondary block w-full">
        Voltar para a página anterior
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.go(-1);
}
</script>
