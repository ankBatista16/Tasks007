<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen" 
      class="p-1 rounded-full text-text-secondary hover:text-text-primary
-primary focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <span class="sr-only">Ver notificações</span>
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span 
          v-if="notificationsStore.unreadCount > 0" 
          class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
        >
          {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
        </span>
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
        class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-5"
      >
        <div class="py-2">
          <div class="px-4 py-2 border-b border-border flex justify-between items-center">
            <h3 class="text-sm font-medium text-text-primary">Notificações</h3>
            <button 
              v-if="notificationsStore.unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-primary hover:text-primary/80"
            >
              Marcar todas como lidas
            </button>
          </div>
          
          <div v-if="notificationsStore.loading" class="px-4 py-3 text-sm text-text-secondary">
            Carregando notificações...
          </div>
          
          <div v-else-if="notificationsStore.error" class="px-4 py-3 text-sm text-error">
            {{ notificationsStore.error }}
          </div>
          
          <div v-else-if="!notificationsStore.notifications.length" class="px-4 py-3 text-sm text-text-secondary">
            Nenhuma notificação
          </div>
          
          <div v-else class="max-h-60 overflow-y-auto">
            <button
              v-for="notification in notificationsStore.notifications"
              :key="notification.id"
              @click="markAsRead(notification.id)"
              class="w-full text-left px-4 py-3 hover:bg-surface-light border-b border-border last:border-b-0"
              :class="{ 'bg-primary/5': !notification.read }"
            >
              <div class="flex justify-between items-start">
                <p class="text-sm font-medium text-text-primary">{{ notification.title }}</p>
                <span class="text-xs text-text-secondary">{{ formatDate(notification.created_at) }}</span>
              </div>
              <p class="text-xs text-text-secondary mt-1">{{ notification.message }}</p>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotificationsStore } from '@/stores/notifications';

const notificationsStore = useNotificationsStore();
const isOpen = ref(false);

const closeDropdown = (e: MouseEvent) => {
  if (isOpen.value) {
    isOpen.value = false;
  }
};

const markAsRead = (id: string) => {
  notificationsStore.markAsRead(id);
};

const markAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `Hoje, ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `Ontem, ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  
  // Configurar listener para notificações em tempo real
  const unsubscribe = notificationsStore.setupRealtimeSubscription();
  
  onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
    if (unsubscribe) unsubscribe();
  });
});
</script>
