<template>
  <aside class="w-64 bg-surface border-r border-border h-screen sticky top-0 hidden md:block">
    <div class="p-4">
      <router-link to="/" class="text-primary font-bold text-xl flex items-center">
        <span class="text-2xl mr-2">✨</span>
        TaskFlow
      </router-link>
    </div>
    
    <nav class="mt-6">
      <ul class="space-y-2">
        <li>
          <router-link 
            to="/" 
            class="flex items-center px-4 py-2 text-text hover:bg-background/50"
            :class="{ 'bg-primary/10 text-primary': isActive('/') }"
          >
            <span class="mr-3">🏠</span>
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link 
            to="/projects" 
            class="flex items-center px-4 py-2 text-text hover:bg-background/50"
            :class="{ 'bg-primary/10 text-primary': isActive('/projects') }"
          >
            <span class="mr-3">📂</span>
            Projetos
          </router-link>
        </li>
        <li>
          <router-link 
            to="/notifications" 
            class="flex items-center px-4 py-2 text-text hover:bg-background/50"
            :class="{ 'bg-primary/10 text-primary': isActive('/notifications') }"
          >
            <span class="mr-3">🔔</span>
            Notificações
            <span 
              v-if="notificationsStore.unreadCount > 0"
              class="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1"
            >
              {{ notificationsStore.unreadCount }}
            </span>
          </router-link>
        </li>
        <li v-if="authStore.isAdmin">
          <router-link 
            to="/admin" 
            class="flex items-center px-4 py-2 text-text hover:bg-background/50"
            :class="{ 'bg-primary/10 text-primary': isActive('/admin') }"
          >
            <span class="mr-3">⚙️</span>
            Administração
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          {{ userInitials }}
        </div>
        <div class="ml-3">
          <p class="font-medium truncate">{{ authStore.user?.full_name }}</p>
          <router-link to="/profile" class="text-sm text-primary hover:underline">
            Ver perfil
          </router-link>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';

const route = useRoute();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const userInitials = computed(() => {
  if (!authStore.user?.full_name) return '';
  
  const nameParts = authStore.user.full_name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
}
</script>
