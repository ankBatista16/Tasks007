<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl font-bold">Seu Perfil</h1>
      <p class="text-text-secondary">Gerencie suas informações pessoais</p>
    </header>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card">
          <h2 class="text-lg font-semibold mb-6">Informações Pessoais</h2>
          
          <form @submit.prevent="updateProfile">
            <div v-if="error" class="mb-4 p-3 bg-error/10 border border-error text-error rounded">
              {{ error }}
            </div>
            
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Nome Completo</label>
              <input 
                id="name" 
                v-model="profileData.name" 
                type="text" 
                required 
                class="input"
                :disabled="loading"
              />
            </div>
            
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input 
                id="email" 
                v-model="profileData.email" 
                type="email" 
                required 
                class="input"
                disabled
              />
              <p class="mt-1 text-xs text-text-secondary">O email não pode ser alterado</p>
            </div>
            
            <div class="mb-6">
              <label for="avatar_url" class="block text-sm font-medium text-text-secondary mb-1">URL da Foto de Perfil</label>
              <input 
                id="avatar_url" 
                v-model="profileData.avatar_url" 
                type="url" 
                class="input"
                :disabled="loading"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p class="mt-1 text-xs text-text-secondary">Deixe em branco para usar as iniciais do seu nome</p>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="loading"
              >
                <span v-if="loading">Salvando...</span>
                <span v-else>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div>
        <div class="card mb-6">
          <h2 class="text-lg font-semibold mb-4">Seu Perfil</h2>
          
          <div class="flex flex-col items-center">
            <div 
              v-if="profileData.avatar_url" 
              class="h-24 w-24 rounded-full bg-cover bg-center mb-4"
              :style="{ backgroundImage: `url(${profileData.avatar_url})` }"
            ></div>
            <div 
              v-else 
              class="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl mb-4"
            >
              {{ userInitials }}
            </div>
            
            <h3 class="text-xl font-medium">{{ profileData.name }}</h3>
            <p class="text-text-secondary">{{ profileData.email }}</p>
            
            <div class="mt-4 w-full">
              <div class="flex justify-between py-2 border-b border-border">
                <span class="text-text-secondary">Função</span>
                <span>{{ roleDisplay }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-border">
                <span class="text-text-secondary">Criar Projetos</span>
                <span>{{ profileData.can_create_projects ? 'Sim' : 'Não' }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-text-secondary">Criar Tarefas</span>
                <span>{{ profileData.can_create_tasks ? 'Sim' : 'Não' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Segurança</h2>
          
          <div class="space-y-3">
            <button 
              @click="showChangePasswordModal = true" 
              class="btn-secondary w-full"
            >
              Alterar Senha
            </button>
            
            <button 
              @click="logout" 
              class="btn-danger w-full"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de alteração de senha -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Alterar Senha</h2>
        
        <form @submit.prevent="changePassword">
          <div v-if="passwordError" class="mb-4 p-3 bg-error/10 border border-error text-error rounded">
            {{ passwordError }}
          </div>
          
          <div class="mb-4">
            <label for="current_password" class="block text-sm font-medium text-text-secondary mb-1">Senha Atual</label>
            <input 
              id="current_password" 
              v-model="passwordData.current" 
              type="password" 
              required 
              class="input"
              :disabled="passwordLoading"
            />
          </div>
          
          <div class="mb-4">
            <label for="new_password" class="block text-sm font-medium text-text-secondary mb-1">Nova Senha</label>
            <input 
              id="new_password" 
              v-model="passwordData.new" 
              type="password" 
              required 
              minlength="6"
              class="input"
              :disabled="passwordLoading"
            />
          </div>
          
          <div class="mb-6">
            <label for="confirm_password" class="block text-sm font-medium text-text-secondary mb-1">Confirmar Nova Senha</label>
            <input 
              id="confirm_password" 
              v-model="passwordData.confirm" 
              type="password" 
              required 
              class="input"
              :disabled="passwordLoading"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="showChangePasswordModal = false" 
              class="btn-secondary"
              :disabled="passwordLoading"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="passwordLoading"
            >
              <span v-if="passwordLoading">Alterando...</span>
              <span v-else>Alterar Senha</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const profileData = ref({
  name: authStore.profile?.name || '',
  email: authStore.profile?.email || '',
  avatar_url: authStore.profile?.avatar_url || '',
  role: authStore.profile?.role || 'user',
  can_create_projects: authStore.profile?.can_create_projects || false,
  can_create_tasks: authStore.profile?.can_create_tasks || false
});

const loading = ref(false);
const error = ref<string | null>(null);

const showChangePasswordModal = ref(false);
const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
});
const passwordLoading = ref(false);
const passwordError = ref<string | null>(null);

const userInitials = computed(() => {
  if (!profileData.value.name) return '?';
  
  const nameParts = profileData.value.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (
    nameParts[0].charAt(0) + 
    nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
});

const roleDisplay = computed(() => {
  return profileData.value.role === 'admin' ? 'Administrador' : 'Usuário';
});

async function updateProfile() {
  try {
    loading.value = true;
    error.value = null;
    
    const result = await authStore.updateProfile({
      name: profileData.value.name,
      avatar_url: profileData.value.avatar_url || null
    });
    
    if (result.success) {
      window.notify.success('Perfil atualizado com sucesso');
    } else {
      error.value = result.error || 'Erro ao atualizar perfil';
    }
  } catch (err: any) {
    console.error('Erro ao atualizar perfil:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function changePassword() {
  try {
    passwordLoading.value = true;
    passwordError.value = null;
    
    if (passwordData.value.new !== passwordData.value.confirm) {
      passwordError.value = 'As senhas não coincidem';
      return;
    }
    
    if (passwordData.value.new.length < 6) {
      passwordError.value = 'A nova senha deve ter pelo menos 6 caracteres';
      return;
    }
    
    // Verificar senha atual fazendo login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: authStore.profile?.email || '',
      password: passwordData.value.current
    });
    
    if (loginError) {
      passwordError.value = 'Senha atual incorreta';
      return;
    }
    
    // Alterar senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordData.value.new
    });
    
    if (updateError) throw updateError;
    
    window.notify.success('Senha alterada com sucesso');
    showChangePasswordModal.value = false;
    
    // Limpar formulário
    passwordData.value = {
      current: '',
      new: '',
      confirm: ''
    };
  } catch (err: any) {
    console.error('Erro ao alterar senha:', err);
    passwordError.value = err.message;
  } finally {
    passwordLoading.value = false;
  }
}

async function logout() {
  const result = await authStore.logout();
  if (result.success) {
    router.push('/auth/login');
  }
}
</script>
