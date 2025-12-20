<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen" 
      class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <span class="sr-only">Abrir menu do usuário</span>
      <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
        {{ userInitials }}
      </div>
    </button>
    
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-5 divide-y divide-border"
      >
        <div class="py-1">
          <div class="px-4 py-2">
            <p class="text-sm font-medium text-text-primary">{{ authStore.profile?.name }}</p>
            <p class="text-xs text-text-secondary truncate">{{ authStore.profile?.email }}</p>
          </div>
        </div>
        <div class="py-1">
          <router-link 
            to="/profile" 
            class="block px-4 py-2 text-sm text-text-primary hover:bg-surface-light"
            @click="isOpen = false"
          >
            Seu Perfil
          </router-link>
        </div>
        <div class="py-1">
          <button 
            @click="logout" 
            class="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-light"
          >
            Sair
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);

const userInitials = computed(() => {
  if (!authStore.profile?.name) return '?';
  
  const nameParts = authStore.profile.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (
    nameParts[0].charAt(0) + 
    nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
});

const closeDropdown = (e: MouseEvent) => {
  if (isOpen.value) {
    isOpen.value = false;
  }
};

const logout = async () => {
  const result = await authStore.logout();
  if (result.success) {
    isOpen.value = false;
    router.push('/auth/login');
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>
