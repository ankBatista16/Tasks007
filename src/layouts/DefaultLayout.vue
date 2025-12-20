<template>
  <div class="min-h-screen bg-background text-text flex">
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out bg-surface border-r border-border"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <div class="h-16 flex items-center justify-between px-4 border-b border-border">
        <router-link to="/" class="flex items-center">
          <span class="text-xl font-bold text-primary">TaskFlow</span>
        </router-link>
        <button 
          @click="toggleSidebar" 
          class="md:hidden p-2 rounded-md hover:bg-primary/10 text-text-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <nav class="p-4 space-y-1">
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ 'active': $route.path === '/' }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <router-link 
          to="/projects" 
          class="nav-link"
          :class="{ 'active': $route.path.startsWith('/projects') }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span>Projetos</span>
        </router-link>
        
        <router-link 
          to="/tasks" 
          class="nav-link"
          :class="{ 'active': $route.path.startsWith('/tasks') }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
          </svg>
          <span>Tarefas</span>
        </router-link>
        
        <div v-if="authStore.profile?.role === 'admin'" class="pt-4 pb-2">
          <div class="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3">
            Administração
          </div>
        </div>
        
        <router-link 
          v-if="authStore.profile?.role === 'admin'"
          to="/admin/users" 
          class="nav-link"
          :class="{ 'active': $route.path.startsWith('/admin') }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
          <span>Usuários</span>
        </router-link>
      </nav>
    </aside>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col md:pl-64">
      <!-- Top navbar -->
      <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
        <div class="flex items-center">
          <button 
            @click="toggleSidebar" 
            class="md:hidden p-2 rounded-md hover:bg-primary/10 text-text-secondary mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <h1 class="text-lg font-semibold md:hidden">
            TaskFlow
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button 
              @click="showNotifications = !showNotifications" 
              class="p-2 rounded-full hover:bg-primary/10 text-text-secondary relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 h-4 w-4 bg-error text-white text-xs flex items-center justify-center rounded-full">
                {{ unreadNotifications }}
              </span>
            </button>
            
            <!-- Dropdown de notificações -->
            <div 
              v-if="showNotifications" 
              class="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-10"
            >
              <div class="p-3 border-b border-border flex justify-between items-center">
                <h3 class="font-medium">Notificações</h3>
                <button 
                  v-if="notifications.length > 0" 
                  @click="markAllAsRead" 
                  class="text-xs text-primary hover:underline"
                >
                  Marcar todas como lidas
                </button>
              </div>
              
              <div v-if="notifications.length === 0" class="p-4 text-center text-text-secondary">
                Nenhuma notificação
              </div>
              
              <div v-else class="max-h-80 overflow-y-auto">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="p-3 border-b border-border last:border-b-0 hover:bg-primary/5"
                  :class="{ 'bg-primary/10': !notification.read }"
                >
                  <div class="flex justify-between items-start">
                    <p class="text-sm" :class="{ 'font-medium': !notification.read }">
                      {{ notification.message }}
                    </p>
                    <button 
                      @click="markAsRead(notification.id)" 
                      class="text-xs text-primary hover:underline ml-2"
                    >
                      {{ notification.read ? 'Lida' : 'Marcar como lida' }}
                    </button>
                  </div>
                  <p class="text-xs text-text-secondary mt-1">
                    {{ formatRelativeTime(notification.created_at) }}
                  </p>
                </div>
              </div>
              
              <div class="p-2 border-t border-border">
                <button class="text-sm text-primary hover:underline w-full text-center">
                  Ver todas
                </button>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu" 
              class="flex items-center space-x-2"
            >
              <div 
                v-if="authStore.profile?.avatar_url" 
                class="h-8 w-8 rounded-full bg-cover bg-center"
                :style="{ backgroundImage: `url(${authStore.profile.avatar_url})` }"
              ></div>
              <div 
                v-else 
                class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white"
              >
                {{ userInitials }}
              </div>
              
              <span class="hidden md:block text-sm font-medium">
                {{ authStore.profile?.name || 'Usuário' }}
              </span>
              
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Dropdown de usuário -->
            <div 
              v-if="showUserMenu" 
              class="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-10"
            >
              <div class="p-3 border-b border-border">
                <p class="font-medium">{{ authStore.profile?.name || 'Usuário' }}</p>
                <p class="text-xs text-text-secondary">{{ authStore.profile?.email }}</p>
              </div>
              
              <div class="p-2">
                <router-link 
                  to="/profile" 
                  class="block px-3 py-2 rounded-md hover:bg-primary/10 text-sm"
                  @click="showUserMenu = false"
                >
                  Meu Perfil
                </router-link>
                
                <button 
                  @click="logout" 
                  class="block w-full text-left px-3 py-2 rounded-md hover:bg-error/10 text-error text-sm"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="flex-1 p-4 md:p-6 overflow-auto">
        <router-view />
      </main>
    </div>
    
    <!-- Overlay para fechar o sidebar em dispositivos móveis -->
    <div 
      v-if="sidebarOpen" 
      @click="toggleSidebar" 
      class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(window.innerWidth >= 768);
const showUserMenu = ref(false);
const showNotifications = ref(false);

// Dados simulados para notificações
const notifications = ref([
  {
    id: '1',
    message: 'Nova tarefa atribuída a você: "Implementar login com Google"',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutos atrás
  },
  {
    id: '2',
    message: 'João comentou na tarefa "Criar página de perfil"',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 horas atrás
  },
  {
    id: '3',
    message: 'Prazo da tarefa "Implementar notificações" está próximo',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 dia atrás
  }
]);

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const userInitials = computed(() => {
  if (!authStore.profile?.name) return '?';
  
  const nameParts = authStore.profile.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (
    nameParts[0].charAt(0) + 
    nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
});

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function markAsRead(id: string) {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

function markAllAsRead() {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
}

async function logout() {
  const result = await authStore.logout();
  if (result.success) {
    router.push('/auth/login');
  }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  return formatDistance(date, new Date(), { addSuffix: true, locale: ptBR });
}

// Fechar dropdowns quando clicar fora deles
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  
  if (showUserMenu.value && !target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
  
  if (showNotifications.value && !target.closest('.notifications')) {
    showNotifications.value = false;
  }
}

// Ajustar sidebar quando a janela for redimensionada
function handleResize() {
  if (window.innerWidth >= 768) {
    sidebarOpen.value = true;
  } else {
    sidebarOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-md text-text-secondary hover:bg-primary/10 hover:text-text-primary
;
}

.nav-link.active {
  @apply bg-primary/20 text-primary;
}
</style>
