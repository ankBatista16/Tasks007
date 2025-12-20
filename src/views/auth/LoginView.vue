<template>
  <div class="max-w-md w-full mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">Entrar no TaskFlow</h1>
      <p class="text-text-secondary">Faça login para acessar sua conta</p>
    </div>

    <div
      v-if="error"
      class="bg-error/10 border border-error text-error p-4 rounded-lg mb-6"
    >
      {{ error }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label
          for="email"
          class="block text-sm font-medium text-text-secondary mb-1"
          >Email</label
        >
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
        <div class="flex justify-between items-center mb-1">
          <label
            for="password"
            class="block text-sm font-medium text-text-secondary"
            >Senha</label
          >
          <button
            type="button"
            @click="showForgotPassword = true"
            class="text-sm text-primary hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input"
          :disabled="loading"
          placeholder="••••••••"
        />
      </div>

      <div class="flex items-center">
        <input
          id="remember"
          v-model="rememberMe"
          type="checkbox"
          class="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 bg-background"
          :disabled="loading"
        />
        <label for="remember" class="ml-2 block text-sm text-text-secondary">
          Lembrar de mim
        </label>
      </div>

      <button type="submit" class="btn-primary w-full" :disabled="loading">
        <span v-if="loading">Entrando...</span>
        <span v-else>Entrar</span>
      </button>

      <div class="text-center text-sm text-text-secondary">
        Não tem uma conta?
        <router-link to="/auth/register" class="text-primary hover:underline">
          Registre-se
        </router-link>
      </div>
    </form>

    <!-- Modal de recuperação de senha -->
    <div
      v-if="showForgotPassword"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Recuperar Senha</h2>

        <div
          v-if="resetSuccess"
          class="bg-success/10 border border-success text-success p-4 rounded-lg mb-6"
        >
          Email de recuperação enviado com sucesso! Verifique sua caixa de
          entrada.
        </div>

        <div
          v-else-if="resetError"
          class="bg-error/10 border border-error text-error p-4 rounded-lg mb-6"
        >
          {{ resetError }}
        </div>

        <form v-if="!resetSuccess" @submit.prevent="handleResetPassword">
          <div class="mb-6">
            <label
              for="reset-email"
              class="block text-sm font-medium text-text-secondary mb-1"
              >Email</label
            >
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              class="input"
              :disabled="resetLoading"
              placeholder="seu@email.com"
            />
            <p class="mt-1 text-xs text-text-secondary">
              Enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showForgotPassword = false"
              class="btn-secondary"
              :disabled="resetLoading"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="resetLoading">
              <span v-if="resetLoading">Enviando...</span>
              <span v-else>Enviar Link</span>
            </button>
          </div>
        </form>

        <div v-else class="flex justify-end">
          <button
            type="button"
            @click="showForgotPassword = false"
            class="btn-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// 👇 estados vindos da store
const error = computed(() => authStore.error);
const loading = computed(() => authStore.loading);

// Campos do formulário
const email = ref("");
const password = ref("");
const rememberMe = ref(false);

// Recuperação de senha
const showForgotPassword = ref(false);
const resetEmail = ref("");
const resetLoading = ref(false);
const resetError = ref<string | null>(null);
const resetSuccess = ref(false);

async function handleLogin() {
  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    router.push("/");
  }
}

async function handleResetPassword() {
  try {
    resetLoading.value = true;
    resetError.value = null;
    resetSuccess.value = false;

    const { error } = await supabase.auth.resetPasswordForEmail(
      resetEmail.value,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );

    if (error) throw error;

    resetSuccess.value = true;
  } catch (err: any) {
    resetError.value = err?.message ?? "Erro ao enviar email de recuperação";
  } finally {
    resetLoading.value = false;
  }
}
</script>


