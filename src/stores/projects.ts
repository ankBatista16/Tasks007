import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/supabase';
import type { Project, ProjectMember, User } from '@/types';
import { useAuthStore } from './auth';
import { toast } from 'vue-sonner';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  /* ----------------------------------------
   * FETCH ALL PROJECTS (RESPEITA RLS)
   * ------------------------------------- */
  async function fetchProjects() {
    try {
      loading.value = true;
      error.value = null;

      if (!authStore.user) return;

      // ADMIN → vê tudo
      if (authStore.isAdmin) {
        const { data, error: err } = await supabase
          .from('projects')
          .select(`
            *,
            members:project_members(
              *,
              user:profiles(*)
            )
          `)
          .order('created_at', { ascending: false });

        if (err) throw err;

        projects.value = data ?? [];
        return;
      }

      // 1️⃣ Projetos criados pelo usuário
      const owned = await supabase
        .from('projects')
        .select(`
          *,
          members:project_members(
            *,
            user:profiles(*)
          )
        `)
        .eq('created_by', authStore.user.id)
        .order('created_at', { ascending: false });

      // 2️⃣ Projetos onde é membro
      const memberOf = await supabase
        .from('projects')
        .select(`
          *,
          members:project_members(
            *,
            user:profiles(*)
          ),
          project_members!inner(user_id)
        `)
        .eq('project_members.user_id', authStore.user.id)
        .order('created_at', { ascending: false });

      if (owned.error) throw owned.error;
      if (memberOf.error) throw memberOf.error;

      const map = new Map<string, Project>();
      [...(owned.data ?? []), ...(memberOf.data ?? [])].forEach(p =>
        map.set(p.id, p)
      );

      projects.value = Array.from(map.values());
    } catch (err: any) {
      console.error('Erro ao buscar projetos:', err);
      error.value = err.message;
      toast.error('Erro ao carregar projetos');
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * FETCH PROJECT BY ID
   * ------------------------------------- */
  async function fetchProjectById(id: string) {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: err } = await supabase
        .from('projects')
        .select(`
          *,
          members:project_members(
            *,
            user:profiles(*)
          )
        `)
        .eq('id', id)
        .single();

      if (err) throw err;

      currentProject.value = data;
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar projeto:', err);
      error.value = err.message;
      toast.error('Erro ao carregar projeto');
      return null;
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * CREATE PROJECT
   * ------------------------------------- */
  async function createProject(projectData: {
    name: string;
    description?: string;
  }) {
    try {
      if (!authStore.user) throw new Error('Usuário não autenticado');

      loading.value = true;
      error.value = null;

      const { data: project, error: err } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description ?? null,
          status: 'active',
          created_by: authStore.user.id
        })
        .select()
        .single();

      if (err) throw err;

      await supabase.from('project_members').insert({
        project_id: project.id,
        user_id: authStore.user.id,
        role: 'owner'
      });

      const fullProject = await fetchProjectById(project.id);
      if (fullProject) {
        projects.value.unshift(fullProject);
      }

      toast.success('Projeto criado com sucesso!');
      return { success: true, project: fullProject };
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      error.value = err.message;
      toast.error('Erro ao criar projeto');
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * UPDATE PROJECT
   * ------------------------------------- */
  async function updateProject(id: string, projectData: Partial<Project>) {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: err } = await supabase
        .from('projects')
        .update({
          ...projectData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;

      const idx = projects.value.findIndex(p => p.id === id);
      if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...data };

      if (currentProject.value?.id === id) {
        currentProject.value = { ...currentProject.value, ...data };
      }

      toast.success('Projeto atualizado com sucesso!');
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao atualizar projeto:', err);
      error.value = err.message;
      toast.error('Erro ao atualizar projeto');
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * DELETE PROJECT
   * ------------------------------------- */
  async function deleteProject(id: string) {
    try {
      loading.value = true;
      error.value = null;

      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (err) throw err;

      projects.value = projects.value.filter(p => p.id !== id);
      if (currentProject.value?.id === id) currentProject.value = null;

      toast.success('Projeto excluído com sucesso!');
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao excluir projeto:', err);
      error.value = err.message;
      toast.error('Erro ao excluir projeto');
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * RESET (LOGOUT SAFE)
   * ------------------------------------- */
  function reset() {
    projects.value = [];
    currentProject.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    reset
  };
});
