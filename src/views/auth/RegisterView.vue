<template>
  <div class="max-w-md w-full mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">Criar Conta</h1>
      <p class="text-text-secondary">Registre-se para começar a usar o TaskFlow</p>
    </div>
    
    <div v-if="error" class="bg-error/10 border border-error text-error p-4 rounded-lg mb-6">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleRegister" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Nome Completo</label>
        <input 
          id="name" 
          v-model="name" 
          type="text" 
          required 
          class="input"
          :disabled="loading"
          placeholder="Seu Nome"
        />
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-text-secondary mb-1">Email</label>
        <input 
          id="email" 
          v-model="email" 
          type="email" 
          required 
          class="input"
          :disabled="loading"
          placeholder="seu@email.com"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-text-secondary mb-1">Senha</label>
        <input 
          id="password" 
          v-model="password" 
          type="password" 
          required 
          minlength="6"
          class="input"
          :disabled="loading"
          placeholder="Mínimo de 6 caracteres"
        />
      </div>
      
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-text-secondary mb-1">Confirmar Senha</label>
        <input 
          id="confirmPassword" 
          v-model="confirmPassword" 
          type="password" 
          required 
          class="input"
          :disabled="loading"
          placeholder="Digite a senha novamente"
        />
        <p v-if="passwordMismatch" class="mt-1 text-xs text-error">
          As senhas não coincidem
        </p>
      </div>
      
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input 
            id="terms" 
            v-model="acceptTerms" 
            type="checkbox" 
            required
            class="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 bg-background"
            :disabled="loading"
          />
        </div>
        <div class="ml-2 text-sm">
          <label for="terms" class="text-text-secondary">
            Eu concordo com os 
            <a href="#" class="text-primary hover:underline">Termos de Serviço</a>
            e 
            <a href="#" class="text-primary hover:underline">Política de Privacidade</a>
          </label>
        </div>
      </div>
      
      <button 
        type="submit" 
        class="btn-primary w-full"
        :disabled="loading || passwordMismatch"
      >
        <span v-if="loading">Registrando...</span>
        <span v-else>Criar Conta</span>
      </button>
      
      <div class="text-center text-sm text-text-secondary">
        Já tem uma conta?
        <router-link to="/auth/login" class="text-primary hover:underline">
          Faça login
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value;
});

// Limpar erro quando o usuário começa a digitar novamente
watch([email, password, confirmPassword], () => {
  error.value = null;
});

async function handleRegister() {
  if (passwordMismatch.value) {
    error.value = 'As senhas não coincidem';
    return;
  }
  
  try {
    loading.value = true;
    error.value = null;
    
    const result = await authStore.register({
      email: email.value,
      password: password.value,
      name: name.value
    });
    
    if (result.success) {
      router.push('/');
    } else {
      error.value = result.error || 'Erro ao criar conta';
    }
  } catch (err: any) {
    console.error('Erro ao registrar:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
