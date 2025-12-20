import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users_profile']['Row'];

type AuthResult =
  | { success: true }
  | { success: false; error: string };

let authListener:
  | { data: { subscription: { unsubscribe: () => void } } }
  | null = null;

function parseError(err: any): string {
  return err?.message ?? 'Ocorreu um erro inesperado';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const profile = ref<UserProfile | null>(null);

  const authLoading = ref(false);
  const profileLoading = ref(false);

  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => profile.value?.role === 'admin');
  const canCreateProjects = computed(
    () => isAdmin.value || !!profile.value?.can_create_projects
  );
  const canCreateTasks = computed(
    () => isAdmin.value || !!profile.value?.can_create_tasks
  );

  async function initialize() {
    try {
      authLoading.value = true;
      error.value = null;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        user.value = session.user;
      } else {
        user.value = null;
        profile.value = null;
      }

      if (!authListener) {
        authListener = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              user.value = session.user;
              await fetchProfile();
            }

            if (event === 'SIGNED_OUT') {
              user.value = null;
              profile.value = null;
            }
          }
        );
      }

      if (user.value) {
        await fetchProfile();
      }
    } catch (err: any) {
      console.error('Erro ao inicializar autenticação:', err);
      error.value = parseError(err);
    } finally {
      authLoading.value = false;
    }
  }

  async function fetchProfile() {
    if (!user.value) return;

    try {
      profileLoading.value = true;

      const { data, error: err } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', user.value.id)
        .single();

      if (err) {
        // Perfil não existe (ex: usuário criado manualmente)
        if (err.code === 'PGRST116') {
          profile.value = null;
          return;
        }
        throw err;
      }

      profile.value = data;
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      error.value = 'Não foi possível carregar o perfil do usuário';
    } finally {
      profileLoading.value = false;
    }
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      authLoading.value = true;
      error.value = null;

      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (err) throw err;

      return { success: true };
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      const message = parseError(err);
      error.value = message;
      return { success: false, error: message };
    } finally {
      authLoading.value = false;
    }
  }

  async function register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
    try {
      authLoading.value = true;
      error.value = null;

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Falha ao criar usuário');

      const { error: profileError } = await supabase
        .from('users_profile')
        .insert({
          id: data.user.id,
          name,
          email,
          role: 'user',
          can_create_projects: false,
          can_create_tasks: false,
        });

      if (profileError) throw profileError;

      return { success: true };
    } catch (err: any) {
      console.error('Erro ao registrar:', err);
      const message = parseError(err);
      error.value = message;
      return { success: false, error: message };
    } finally {
      authLoading.value = false;
    }
  }

  async function logout(): Promise<AuthResult> {
    try {
      authLoading.value = true;
      error.value = null;

      const { error: err } = await supabase.auth.signOut();
      if (err) throw err;

      user.value = null;
      profile.value = null;

      return { success: true };
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
      const message = parseError(err);
      error.value = message;
      return { success: false, error: message };
    } finally {
      authLoading.value = false;
    }
  }

  async function updateProfile(
    updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>
  ): Promise<AuthResult> {
    if (!user.value) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      profileLoading.value = true;
      error.value = null;

      const { data, error: err } = await supabase
        .from('users_profile')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single();

      if (err) throw err;

      profile.value = data;
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      const message = parseError(err);
      error.value = message;
      return { success: false, error: message };
    } finally {
      profileLoading.value = false;
    }
  }

  return {
    user,
    profile,
    authLoading,
    profileLoading,
    error,
    isAuthenticated,
    isAdmin,
    canCreateProjects,
    canCreateTasks,
    initialize,
    login,
    register,
    logout,
    updateProfile,
  };
});
