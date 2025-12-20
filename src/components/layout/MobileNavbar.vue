<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-10">
    <div class="flex justify-around">
      <router-link 
        to="/" 
        class="flex flex-col items-center py-2 px-4"
        :class="{ 'text-primary': isActive('/') }"
      >
        <span class="text-xl">🏠</span>
        <span class="text-xs mt-1">Home</span>
      </router-link>
      
      <router-link 
        to="/projects" 
        class="flex flex-col items-center py-2 px-4"
        :class="{ 'text-primary': isActive('/projects') }"
      >
        <span class="text-xl">📂</span>
        <span class="text-xs mt-1">Projetos</span>
      </router-link>
      
      <router-link 
        to="/notifications" 
        class="flex flex-col items-center py-2 px-4 relative"
        :class="{ 'text-primary': isActive('/notifications') }"
      >
        <span class="text-xl">🔔</span>
        <span 
          v-if="notificationsStore.unreadCount > 0"
          class="absolute top-0 right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ notificationsStore.unreadCount }}
        </span>
        <span class="text-xs mt-1">Notificações</span>
      </router-link>
      
      <router-link 
        to="/profile" 
        class="flex flex-col items-center py-2 px-4"
        :class="{ 'text-primary': isActive('/profile') }"
      >
        <span class="text-xl">👤</span>
        <span class="text-xs mt-1">Perfil</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useNotificationsStore } from '@/stores/notifications';

const route = useRoute();
const notificationsStore = useNotificationsStore();

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
}
</script>
