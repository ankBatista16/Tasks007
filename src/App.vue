<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  
  <Notifications />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import Notifications from '@/components/notifications/Notifications.vue';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

onMounted(async () => {
  // Inicializar o estado de autenticação
  await authStore.initialize();
  
  // Carregar notificações se o usuário estiver autenticado
  if (authStore.isAuthenticated) {
    notificationsStore.fetchNotifications();
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
