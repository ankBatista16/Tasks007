<template>
  <aside class="w-64 bg-surface border-r border-border overflow-y-auto">
    <nav class="mt-5 px-2">
      <div class="space-y-1">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.name" 
          :to="item.to" 
          :class="[
            isActive(item.to) 
              ? 'bg-primary/10 text-primary' 
              : 'text-text-secondary hover:bg-surface-light hover:text-text-primary
-primary',
            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
          ]"
        >
          <component :is="item.icon" class="mr-3 h-6 w-6" />
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="mt-10">
        <h3 class="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Seus Projetos
        </h3>
        <div class="mt-2 space-y-1">
          <div v-if="projectsLoading" class="px-3 py-2 text-sm text-text-secondary">
            Carregando...
          </div>
          <div v-else-if="projectsError" class="px-3 py-2 text-sm text-error">
            Erro ao carregar projetos
          </div>
          <div v-else-if="!recentProjects.length" class="px-3 py-2 text-sm text-text-secondary">
            Nenhum projeto encontrado
          </div>
          <router-link
            v-for="project in recentProjects"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="group flex items-center px-3 py-2 text-sm font-medium text-text-secondary rounded-md hover:bg-surface-light hover:text-text-primary
-primary"
          >
            <span class="truncate">{{ project.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/supabase';
import { useAuthStore } from '@/stores/auth';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

const route = useRoute();
const authStore = useAuthStore();

const recentProjects = ref<Project[]>([]);
const projectsLoading = ref(false);
const projectsError = ref<string | null>(null);

const navigationItems = [
  { 
    name: 'Dashboard', 
    to: '/', 
    icon: 'DashboardIcon' 
  },
  { 
    name: 'Projetos', 
    to: '/projects', 
    icon: 'ProjectsIcon' 
  },
  { 
    name: 'Tarefas', 
    to: '/tasks', 
    icon: 'TasksIcon' 
  },
  { 
    name: 'Perfil', 
    to: '/profile', 
    icon: 'ProfileIcon' 
  },
];

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchRecentProjects();
  }
});

async function fetchRecentProjects() {
  if (!authStore.user) return;
  
  try {
    projectsLoading.value = true;
    projectsError.value = null;
    
    // Buscar projetos em que o usuário é membro
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`created_by.eq.${authStore.user.id},id.in.(select project_id from project_members where user_id = ${authStore.user.id})`)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    recentProjects.value = data || [];
  } catch (err: any) {
    console.error('Erro ao buscar projetos recentes:', err);
    projectsError.value = err.message;
  } finally {
    projectsLoading.value = false;
  }
}

// Componentes de ícones
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
</script>
