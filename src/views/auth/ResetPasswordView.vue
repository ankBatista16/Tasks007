<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 class="text-center text-3xl font-bold text-primary">TaskFlow</h1>
      <h2 class="mt-6 text-center text-2xl font-bold">Redefinir sua senha</h2>
      <p class="mt-2 text-center text-sm text-textSecondary">
        Crie uma nova senha para sua conta
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
        <form v-if="!resetComplete" class="space-y-6" @submit.prevent="handleUpdatePassword">
          <BaseInput
            v-model="password"
            label="Nova senha"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.password"
            hint="Mínimo de 6 caracteres"
          />

          <BaseInput
            v-model="passwordConfirm"
            label="Confirmar nova senha"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.passwordConfirm"
          />

          <div>
            <BaseButton type="submit" variant="primary" class="w-full" :loading="loading">
              Redefinir senha
            </BaseButton>
          </div>
        </form>

        <div v-else class="text-center">
          <div class="text-4xl mb-4">✅</div>
          <h3 class="text-xl font-medium mb-2">Senha redefinida com sucesso!</h3>
          <p class="mb-6">
            Sua senha foi atualizada. Agora você pode entrar na sua conta com a nova senha.
          </p>
          <router-link to="/login">
            <BaseButton variant="primary">Ir para o login</BaseButton>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { toast } from 'vue-sonner';

const router = useRouter();
const authStore = useAuthStore();

const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);
const resetComplete = ref(false);
const errors = ref({
  password: '',
  passwordConfirm: ''
});

onMounted(() => {
  // Check if we have a hash in the URL (from password reset email)
  const hash = window.location.hash;
  if (!hash || !hash.includes('type=recovery')) {
    toast.error('Link de recuperação inválido ou expirado');
    router.push('/login');
  }
});

async function handleUpdatePassword() {
  // Reset errors
  errors.value = {
    password: '',
    passwordConfirm: ''
  };
  
  // Validate form
  let isValid = true;
  
  if (!password.value) {
    errors.value.password = 'Nova senha é obrigatória';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = 'A senha deve ter pelo menos 6 caracteres';
    isValid = false;
  }
  
  if (password.value !== passwordConfirm.value) {
    errors.value.passwordConfirm = 'As senhas não coincidem';
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Submit form
  loading.value = true;
  
  try {
    const { success, error } = await authStore.updatePassword(password.value);
    
    if (success) {
      resetComplete.value = true;
    } else if (error) {
      toast.error(error.message || 'Erro ao redefinir senha');
    }
  } finally {
    loading.value = false;
  }
}
</script>
