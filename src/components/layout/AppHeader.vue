<template>
  <header class="bg-surface border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <button 
            v-if="isMobile" 
            @click="toggleSidebar" 
            class="mr-2 p-2 rounded-md text-text-secondary hover:text-text-primary
-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <router-link to="/" class="flex items-center">
            <span class="text-xl font-bold text-primary">TaskFlow</span>
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <NotificationsDropdown />
          <UserDropdown />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown.vue';
import UserDropdown from '@/components/user/UserDropdown.vue';

const isMobile = ref(window.innerWidth < 768);
const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  // Emitir evento para o componente pai
  window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: sidebarOpen.value }));
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
