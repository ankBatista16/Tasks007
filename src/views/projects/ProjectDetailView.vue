<template>
  <div>
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-pulse text-text-secondary">Carregando projeto...</div>
    </div>

    <div
      v-else-if="error"
      class="bg-error/10 border border-error text-error p-4 rounded-lg"
    >
      {{ error }}
    </div>

    <div
      v-else-if="!project"
      class="bg-surface border border-border p-8 rounded-lg text-center"
    >
      <h3 class="text-xl font-medium mb-2">Projeto não encontrado</h3>
      <p class="text-text-secondary mb-6">
        O projeto que você está procurando não existe ou foi removido
      </p>

      <router-link to="/projects" class="btn-primary">
        Voltar para Projetos
      </router-link>
    </div>

    <div v-else>
      <header class="mb-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold">{{ project.name }}</h1>
            <p class="text-text-secondary">
              Criado por {{ project.created_by_name || "Usuário" }}
            </p>
          </div>

          <span
            class="text-sm px-3 py-1 rounded-full"
            :class="{
              'bg-warning/20 text-warning': project.status === 'pendente',
              'bg-primary/20 text-primary': project.status === 'em andamento',
              'bg-success/20 text-success': project.status === 'concluído',
            }"
          >
            {{ project.status }}
          </span>
        </div>

        <div class="flex flex-wrap gap-4 mt-4">
          <div v-if="project.start_date" class="text-sm text-text-secondary">
            <span class="font-medium">Data de Início:</span>
            {{ formatDate(project.start_date) }}
          </div>
          <div v-if="project.end_date" class="text-sm text-text-secondary">
            <span class="font-medium">Data de Término:</span>
            {{ formatDate(project.end_date) }}
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card mb-6">
            <h2 class="text-lg font-semibold mb-4">Descrição</h2>
            <p
              v-if="project.description"
              class="text-text-secondary whitespace-pre-line"
            >
              {{ project.description }}
            </p>
            <p v-else class="text-text-secondary italic">
              Nenhuma descrição fornecida
            </p>
          </div>

          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Tarefas</h2>

              <button
                v-if="authStore.canCreateTasks"
                @click="showCreateTaskModal = true"
                class="btn-primary text-sm"
              >
                Nova Tarefa
              </button>
            </div>

            <div v-if="tasksLoading" class="py-4 text-text-secondary">
              Carregando tarefas...
            </div>

            <div v-else-if="tasksError" class="py-4 text-error">
              {{ tasksError }}
            </div>

            <div
              v-else-if="!tasks.length"
              class="py-4 text-text-secondary text-center"
            >
              <p>Nenhuma tarefa encontrada</p>
              <button
                v-if="authStore.canCreateTasks"
                @click="showCreateTaskModal = true"
                class="btn-primary mt-4"
              >
                Criar Primeira Tarefa
              </button>
            </div>

            <div v-else>
              <div
                v-for="task in tasks"
                :key="task.id"
                class="border-b border-border last:border-b-0 py-4"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <router-link
                      :to="`/tasks/${task.id}`"
                      class="font-medium hover:text-primary"
                    >
                      {{ task.title }}
                    </router-link>
                    <p
                      v-if="task.description"
                      class="text-sm text-text-secondary mt-1 line-clamp-2"
                    >
                      {{ task.description }}
                    </p>
                  </div>

                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="{
                      'bg-warning/20 text-warning': task.status === 'pendente',
                      'bg-primary/20 text-primary':
                        task.status === 'em andamento',
                      'bg-success/20 text-success': task.status === 'concluída',
                    }"
                  >
                    {{ task.status }}
                  </span>
                </div>

                <div
                  class="flex justify-between items-center mt-3 text-xs text-text-secondary"
                >
                  <div class="flex items-center">
                    <span
                      class="px-2 py-1 rounded-full mr-2"
                      :class="{
                        'bg-error/20 text-error': task.priority === 'alta',
                        'bg-warning/20 text-warning': task.priority === 'média',
                        'bg-success/20 text-success': task.priority === 'baixa',
                      }"
                    >
                      {{ task.priority }}
                    </span>
                    <span v-if="task.due_date"
                      >Prazo: {{ formatDate(task.due_date) }}</span
                    >
                  </div>

                  <div v-if="task.leader_name" class="flex items-center">
                    <span>Responsável: {{ task.leader_name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="card mb-6">
            <h2 class="text-lg font-semibold mb-4">Membros do Projeto</h2>

            <div v-if="membersLoading" class="py-4 text-text-secondary">
              Carregando membros...
            </div>

            <div v-else-if="membersError" class="py-4 text-error">
              {{ membersError }}
            </div>

            <div v-else-if="!members.length" class="py-4 text-text-secondary">
              <p>Apenas você está neste projeto</p>
              <button
                v-if="isProjectOwner"
                @click="showAddMemberModal = true"
                class="btn-secondary mt-4 w-full"
              >
                Adicionar Membros
              </button>
            </div>

            <div v-else>
              <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <div class="flex items-center">
                  <div
                    class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-3"
                  >
                    {{ getInitials(member.name) }}
                  </div>
                  <div>
                    <p class="font-medium">{{ member.name }}</p>
                    <p class="text-xs text-text-secondary">{{ member.role }}</p>
                  </div>
                </div>

                <button
                  v-if="isProjectOwner && member.user_id !== authStore.user?.id"
                  @click="removeMember(member.id)"
                  class="text-error hover:text-error/80 text-sm"
                >
                  Remover
                </button>
              </div>

              <button
                v-if="isProjectOwner"
                @click="showAddMemberModal = true"
                class="btn-secondary mt-4 w-full"
              >
                Adicionar Membros
              </button>
            </div>
          </div>

          <div class="card">
            <h2 class="text-lg font-semibold mb-4">Ações</h2>

            <div class="space-y-3">
              <button
                v-if="isProjectOwner"
                @click="showEditModal = true"
                class="btn-secondary w-full"
              >
                Editar Projeto
              </button>

              <button
                v-if="isProjectOwner"
                @click="confirmDelete"
                class="btn-danger w-full"
              >
                Excluir Projeto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateTaskModal
      v-if="showCreateTaskModal"
      :project-id="projectId"
      @close="showCreateTaskModal = false"
      @created="fetchTasks"
    />

    <AddProjectMemberModal
      v-if="showAddMemberModal"
      :project-id="projectId"
      @close="showAddMemberModal = false"
      @added="fetchMembers"
    />

    <EditProjectModal
      v-if="showEditModal"
      :project="project"
      @close="showEditModal = false"
      @updated="fetchProject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";
import type { Database } from "@/types/supabase";

import CreateTaskModal from "@/components/tasks/CreateTaskModal.vue";
import AddProjectMemberModal from "@/components/projects/AddProjectMemberModal.vue";
import EditProjectModal from "@/components/projects/EditProjectModal.vue";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  created_by_name?: string;
};

type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  leader_name?: string;
};

type Member = {
  id: string;
  user_id: string;
  name: string;
};

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const projectId = route.params.id as string;

const project = ref<Project | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const tasks = ref<Task[]>([]);
const tasksLoading = ref(true);
const tasksError = ref<string | null>(null);

const members = ref<Member[]>([]);
const membersLoading = ref(true);
const membersError = ref<string | null>(null);

const showCreateTaskModal = ref(false);
const showAddMemberModal = ref(false);
const showEditModal = ref(false);

const isProjectOwner = computed(() => {
  return project.value?.created_by === authStore.user?.id;
});

onMounted(async () => {
  await Promise.all([fetchProject(), fetchTasks(), fetchMembers()]);
});

async function fetchProject() {
  try {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("projects")
      .select(
        `
        *,
        created_by_profile:users_profile!projects_created_by_fkey(name)
      `
      )
      .eq("id", projectId)
      .single();

    if (err) throw err;

    if (data) {
      project.value = {
        ...data,
        created_by_name: data.created_by_profile?.name,
      };
    } else {
      project.value = null;
    }
  } catch (err: any) {
    console.error("Erro ao buscar projeto:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function fetchTasks() {
  try {
    tasksLoading.value = true;
    tasksError.value = null;

    const { data, error: err } = await supabase
      .from("tasks")
      .select(
        `
        *,
        leader:users_profile!tasks_leader_id_fkey(name)
      `
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (err) throw err;

    tasks.value = (data || []).map((task) => ({
      ...task,
      leader_name: task.leader?.name,
    }));
  } catch (err: any) {
    console.error("Erro ao buscar tarefas:", err);
    tasksError.value = err.message;
  } finally {
    tasksLoading.value = false;
  }
}

async function fetchMembers() {
  try {
    membersLoading.value = true;
    membersError.value = null;

    const { data, error: err } = await supabase
      .from("project_members")
      .select(
        `
        id,
        user_id,
        user:users_profile!project_members_user_id_fkey(name)
      `
      )
      .eq("project_id", projectId);

    if (err) throw err;

    members.value = (data || []).map((member) => ({
      id: member.id,
      user_id: member.user_id,
      name: member.user?.name || "Usuário",
    }));
  } catch (err: any) {
    console.error("Erro ao buscar membros:", err);
    membersError.value = err.message;
  } finally {
    membersLoading.value = false;
  }
}

async function removeMember(memberId: string) {
  if (!confirm("Tem certeza que deseja remover este membro do projeto?")) {
    return;
  }

  try {
    const { error: err } = await supabase
      .from("project_members")
      .delete()
      .eq("id", memberId);

    if (err) throw err;

    // Atualizar a lista de membros
    members.value = members.value.filter((m) => m.id !== memberId);

    window.notify.success("Membro removido com sucesso");
  } catch (err: any) {
    console.error("Erro ao remover membro:", err);
    window.notify.error("Erro ao remover membro", err.message);
  }
}

async function confirmDelete() {
  if (
    !confirm(
      "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }

  try {
    const { error: err } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (err) throw err;

    window.notify.success("Projeto excluído com sucesso");
    router.push("/projects");
  } catch (err: any) {
    console.error("Erro ao excluir projeto:", err);
    window.notify.error("Erro ao excluir projeto", err.message);
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
