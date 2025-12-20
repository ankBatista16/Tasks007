import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/supabase';
import { useAuthStore } from './auth';
import type { Database } from '@/types/supabase';

type Notification = Database['public']['Tables']['notifications']['Row'];

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const authStore = useAuthStore();
  
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  );

  async function fetchNotifications() {
    if (!authStore.user) return;
    
    try {
      loading.value = true;
      error.value = null;
      
      const { data, error: err } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: false });
      
      if (err) throw err;
      
      notifications.value = data || [];
    } catch (err: any) {
      console.error('Erro ao buscar notificações:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error: err } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (err) throw err;
      
      // Atualizar localmente
      const index = notifications.value.findIndex(n => n.id === id);
      if (index !== -1) {
        notifications.value[index].read = true;
      }
    } catch (err: any) {
      console.error('Erro ao marcar notificação como lida:', err);
      error.value = err.message;
    }
  }

  async function markAllAsRead() {
    if (!authStore.user) return;
    
    try {
      const { error: err } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', authStore.user.id)
        .eq('read', false);
      
      if (err) throw err;
      
      // Atualizar localmente
      notifications.value = notifications.value.map(n => ({ ...n, read: true }));
    } catch (err: any) {
      console.error('Erro ao marcar todas notificações como lidas:', err);
      error.value = err.message;
    }
  }

  // Configurar listener para novas notificações em tempo real
  function setupRealtimeSubscription() {
    if (!authStore.user) return;
    
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${authStore.user.id}`,
      }, (payload) => {
        const newNotification = payload.new as Notification;
        notifications.value = [newNotification, ...notifications.value];
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setupRealtimeSubscription,
  };
});
