import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/supabase';
import type { User } from '@/types';
import { useAuthStore } from './auth';
import { toast } from 'vue-sonner';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const authStore = useAuthStore();
  
  async function fetchUsers() {
    try {
      loading.value = true;
      error.value = null;
      
      // Only admins can fetch all users
      if (!authStore.isAdmin) {
        throw new Error('Permissão negada');
      }
      
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (err) throw err;
      
      users.value = data.map(profile => ({
        id: profile.id,
        email: '', // Email is not stored in profiles table
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role
      }));
    } catch (err: any) {
      console.error('Error fetching users:', err);
      error.value = err.message;
      toast.error('Erro ao carregar usuários');
    } finally {
      loading.value = false;
    }
  }
  
  async function updateUserRole(userId: string, role: 'admin' | 'user') {
    try {
      loading.value = true;
      error.value = null;
      
      // Only admins can update roles
      if (!authStore.isAdmin) {
        throw new Error('Permissão negada');
      }
      
      const { data, error: err } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();
      
      if (err) throw err;
      
      // Update local state
      const index = users.value.findIndex(u => u.id === userId);
      if (index !== -1) {
        users.value[index].role = role;
      }
      
      toast.success('Função do usuário atualizada com sucesso!');
      return { success: true, user: data };
    } catch (err: any) {
      console.error('Error updating user role:', err);
      error.value = err.message;
      toast.error('Erro ao atualizar função do usuário');
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  }
  
  async function searchUsers(query: string) {
    try {
      loading.value = true;
      error.value = null;
      
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .order('full_name')
        .limit(10);
      
      if (err) throw err;
      
      return data.map(profile => ({
        id: profile.id,
        email: '', // Email is not stored in profiles table
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role
      }));
    } catch (err: any) {
      console.error('Error searching users:', err);
      error.value = err.message;
      toast.error('Erro ao buscar usuários');
      return [];
    } finally {
      loading.value = false;
    }
  }
  
  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    searchUsers
  };
});
