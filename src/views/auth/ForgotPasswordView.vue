<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 class="text-center text-3xl font-bold text-primary">TaskFlow</h1>
      <h2 class="mt-6 text-center text-2xl font-bold">Recuperar senha</h2>
      <p class="mt-2 text-center text-sm text-textSecondary">
        Enviaremos um link para redefinir sua senha.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
        <form v-if="!emailSent" class="space-y-6" @submit.prevent="handleResetPassword">
          <BaseInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            required
            :error="error"
          />

          <div>
            <BaseButton type="submit" variant="primary" class="w-full" :loading="loading">
              Enviar link de recuperação
            </BaseButton>
          </div>
        </form>

        <div v-else class="text-center">
          <div class="text-4xl mb-4">📧</div>
          <h3 class="text-xl font-medium mb-2">Email enviado!</h3>
          <p class="mb-6">
            Enviamos um link de recuperação para <strong>{{ email }}</strong>. 
            Verifique sua caixa de entrada e siga as instruções.
          </p>
          <router-link to="/login" class="btn-primary">
            Voltar para o login
          </router-link>
        </div>

        <div class="mt-6 text-center">
          <router-link to="/login" class="text-primary hover:underline">
            Voltar para o login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const authStore = useAuthStore();

const email = ref('');
const loading = ref(false);
const error = ref('');
const emailSent = ref(false);

async function handleResetPassword() {
  // Reset error
  error.value = '';
  
  // Validate form
  if (!email.value) {
    error.value = 'Email é obrigatório';
    return;
  }
  
  // Submit form
  loading.value = true;
  
  try {
    const { success, error: resetError } = await authStore.resetPassword(email.value);
    
    if (success) {
      emailSent.value = true;
    } else if (resetError) {
      error.value = resetError.message;
    }
  } finally {
    loading.value = false;
  }
}
</script>
