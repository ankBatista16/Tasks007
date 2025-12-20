<template>
  <div class="min-h-screen bg-background text-text flex flex-col">
    <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <span class="text-xl font-bold text-primary">TaskFlow</span>
        </router-link>
      </div>
    </header>
    
    <main class="flex-1 flex items-center justify-center p-4">
      <router-view />
    </main>
    
    <footer class="py-4 text-center text-text-secondary text-sm">
      <p>&copy; {{ new Date().getFullYear() }} TaskFlow. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Sem lógica adicional necessária
</script>
