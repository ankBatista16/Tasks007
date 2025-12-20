<template>
  <div>
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Projetos</h1>
        <p class="text-text-secondary">Gerencie seus projetos e equipes</p>
      </div>

      <button
        v-if="authStore.canCreateProjects"
        @click="showCreateModal = true"
        class="btn-primary"
      >
        Novo Projeto
      </button>
    </header>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-pulse text-text-secondary">
        Carregando projetos...
      </div>
    </div>

    <div
      v-else-if="error"
      class="bg-error/10 border border-error text-error p-4 rounded-lg"
    >
      {{ error }}
    </div>

    <div
      v-else-if="!projects.length"
      class="bg-surface border border-border p-8 rounded-lg text-center"
    >
      <h3 class="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
      <p class="text-text-secondary mb-6">
        Comece criando seu primeiro projeto
      </p>

      <button
        v-if="authStore.canCreateProjects"
        @click="showCreateModal = true"
        class="btn-primary"
      >
        Criar Projeto
      </button>
      <p v-else class="text-text-secondary">
        Você não tem permissão para criar projetos. Entre em contato com um
        administrador.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="card hover:border-primary/50 transition-colors"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">{{ project.name }}</h3>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="{
              'bg-warning/20 text-warning': project.status === 'pendente',
              'bg-primary/20 text-primary': project.status === 'em andamento',
              'bg-success/20 text-success': project.status === 'concluído',
            }"
          >
            {{ project.status }}
          </span>
        </div>

        <p
          v-if="project.description"
          class="text-text-secondary mb-4 line-clamp-2"
        >
          {{ project.description }}
        </p>
        <p v-else class="text-text-secondary mb-4 italic">Sem descrição</p>

        <div
          class="flex justify-between items-center text-sm text-text-secondary mb-4"
        >
          <div v-if="project.start_date">
            <span>Início: {{ formatDate(project.start_date) }}</span>
          </div>
          <div v-if="project.end_date">
            <span>Término: {{ formatDate(project.end_date) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <div class="flex -space-x-2">
            <!-- Aqui seriam exibidos os avatares dos membros do projeto -->
            <div
              class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white"
            >
              {{ getInitials(project.created_by_name || "Usuário") }}
            </div>
          </div>

          <router-link :to="`/projects/${project.id}`" class="btn-secondary">
            Ver Detalhes
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de criação de projeto -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Novo Projeto</h2>

        <form @submit.prevent="createProject">
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-text-secondary mb-1"
              >Nome do Projeto</label
            >
            <input
              id="name"
              v-model="newProject.name"
              type="text"
              required
              class="input"
            />
          </div>

          <div class="mb-4">
            <label
              for="description"
              class="block text-sm font-medium text-text-secondary mb-1"
              >Descrição</label
            >
            <textarea
              id="description"
              v-model="newProject.description"
              rows="3"
              class="input"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                for="start_date"
                class="block text-sm font-medium text-text-secondary mb-1"
                >Data de Início</label
              >
              <input
                id="start_date"
                v-model="newProject.start_date"
                type="date"
                class="input"
              />
            </div>
            <div>
              <label
                for="end_date"
                class="block text-sm font-medium text-text-secondary mb-1"
                >Data de Término</label
              >
              <input
                id="end_date"
                v-model="newProject.end_date"
                type="date"
                class="input"
              />
            </div>
          </div>

          <div class="mb-6">
            <label
              for="status"
              class="block text-sm font-medium text-text-secondary mb-1"
              >Status</label
            >
            <select id="status" v-model="newProject.status" class="input">
              <option value="planejado">Planejado</option>
              <option value="em andamento">Em Andamento</option>
              <option value="concluído">Concluído</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showCreateModal = false"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="creatingProject"
            >
              <span v-if="creatingProject">Criando...</span>
              <span v-else>Criar Projeto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  created_by_name?: string;
};

const authStore = useAuthStore();

const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const showCreateModal = ref(false);
const creatingProject = ref(false);
const newProject = ref({
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  status: "pendente",
});

onMounted(async () => {
  await fetchProjects();
});

async function fetchProjects() {
  if (!authStore.user) return;

  try {
    loading.value = true;
    error.value = null;

    const userId = authStore.user.id;

    // 1️⃣ Projetos criados pelo usuário
    const { data: ownedProjects, error: ownedErr } = await supabase
      .from("projects")
      .select(
        `
        *,
        created_by_profile:users_profile!projects_created_by_fkey(name)
      `
      )
      .eq("created_by", userId);

    if (ownedErr) throw ownedErr;

    // 2️⃣ Projetos onde o usuário é membro
    const { data: memberProjects, error: memberErr } = await supabase
      .from("project_members")
      .select(
        `
        project:projects(
          *,
          created_by_profile:users_profile!projects_created_by_fkey(name)
        )
      `
      )
      .eq("user_id", userId);

    if (memberErr) throw memberErr;

    // 3️⃣ Merge sem duplicar
    const map = new Map<string, Project>();

    ownedProjects?.forEach((project) => {
      map.set(project.id, {
        ...project,
        created_by_name: project.created_by_profile?.name,
      });
    });

    memberProjects?.forEach((row) => {
      const project = row.project;
      if (project) {
        map.set(project.id, {
          ...project,
          created_by_name: project.created_by_profile?.name,
        });
      }
    });

    projects.value = Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err: any) {
    console.error("Erro ao buscar projetos:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function createProject() {
  if (!authStore.user) return;

  try {
    creatingProject.value = true;

    const { data, error: err } = await supabase
      .from("projects")
      .insert({
        name: newProject.value.name,
        description: newProject.value.description || null,
        start_date: newProject.value.start_date || null,
        end_date: newProject.value.end_date || null,
        status: newProject.value.status,
        created_by: authStore.user.id,
      })
      .select()
      .single();

    if (err) throw err;

    // Adicionar o novo projeto à lista
    if (data) {
      projects.value.unshift({
        ...data,
        created_by_name: authStore.profile?.name,
      });
    }

    // Fechar o modal e limpar o formulário
    showCreateModal.value = false;
    newProject.value = {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "Planejado",
    };

    window.notify.success("Projeto criado com sucesso");
  } catch (err: any) {
    console.error("Erro ao criar projeto:", err);
    window.notify.error("Erro ao criar projeto", err.message);
  } finally {
    creatingProject.value = false;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

function getInitials(name: string) {
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
}
</script>
