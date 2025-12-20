import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/supabase';
import type { Task, Comment, Attachment } from '@/types';
import { useAuthStore } from './auth';
import { toast } from 'vue-sonner';

function isValidUUID(value?: string) {
  return typeof value === 'string' && value.length === 36;
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const comments = ref<Comment[]>([]);
  const attachments = ref<Attachment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  /* ----------------------------------------
   * COMPUTEDS
   * ------------------------------------- */
  const projectTasks = computed(() => (projectId: string) => {
    if (!isValidUUID(projectId)) return [];
    return tasks.value.filter(t => t.project_id === projectId);
  });

  const tasksByStatus = computed(() => (projectId: string) => {
    const grouped = {
      todo: [] as Task[],
      in_progress: [] as Task[],
      review: [] as Task[],
      done: [] as Task[]
    };

    projectTasks.value(projectId).forEach(task => {
      if (task.status in grouped) {
        grouped[task.status as keyof typeof grouped].push(task);
      }
    });

    return grouped;
  });

  /* ----------------------------------------
   * FETCH TASKS BY PROJECT
   * ------------------------------------- */
  async function fetchProjectTasks(projectId: string) {
    if (!isValidUUID(projectId)) return;

    try {
      loading.value = true;
      error.value = null;

      const { data, error: err } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(*),
          creator:profiles!tasks_created_by_fkey(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (err) throw err;

      const map = new Map<string, Task>();
      [...tasks.value, ...(data ?? [])].forEach(task =>
        map.set(task.id, task)
      );

      tasks.value = Array.from(map.values());
    } catch (err: any) {
      console.error('Erro ao buscar tarefas:', err);
      error.value = err.message;
      toast.error('Erro ao carregar tarefas');
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * FETCH TASK BY ID
   * ------------------------------------- */
  async function fetchTaskById(id: string) {
    if (!isValidUUID(id)) return null;

    try {
      loading.value = true;
      error.value = null;

      comments.value = [];
      attachments.value = [];

      const { data, error: err } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(*),
          creator:profiles!tasks_created_by_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (err) throw err;

      currentTask.value = data;

      await Promise.all([
        fetchTaskComments(id),
        fetchTaskAttachments(id)
      ]);

      return data;
    } catch (err: any) {
      console.error('Erro ao buscar tarefa:', err);
      error.value = err.message;
      toast.error('Erro ao carregar tarefa');
      return null;
    } finally {
      loading.value = false;
    }
  }

  /* ----------------------------------------
   * COMMENTS
   * ------------------------------------- */
  async function fetchTaskComments(taskId: string) {
    if (!isValidUUID(taskId)) return;

    const { data, error: err } = await supabase
      .from('comments')
      .select(`*, user:profiles(*)`)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (err) {
      console.error(err);
      toast.error('Erro ao carregar comentários');
      return;
    }

    comments.value = data ?? [];
  }

  async function addComment(taskId: string, content: string) {
    if (!isValidUUID(taskId) || !authStore.user) return;

    try {
      const { data, error: err } = await supabase
        .from('comments')
        .insert({
          content,
          task_id: taskId,
          user_id: authStore.user.id
        })
        .select(`*, user:profiles(*)`)
        .single();

      if (err) throw err;

      comments.value.push(data);
      toast.success('Comentário adicionado!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao adicionar comentário');
    }
  }

  async function deleteComment(id: string) {
    if (!isValidUUID(id)) return;

    const { error: err } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (err) {
      toast.error('Erro ao excluir comentário');
      return;
    }

    comments.value = comments.value.filter(c => c.id !== id);
  }

  /* ----------------------------------------
   * ATTACHMENTS
   * ------------------------------------- */
  async function fetchTaskAttachments(taskId: string) {
    if (!isValidUUID(taskId)) return;

    const { data, error: err } = await supabase
      .from('attachments')
      .select(`*, uploader:profiles(*)`)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (err) {
      console.error(err);
      toast.error('Erro ao carregar anexos');
      return;
    }

    attachments.value = data ?? [];
  }

  async function deleteAttachment(id: string, path: string) {
    if (!isValidUUID(id)) return;

    await supabase.storage.from('attachments').remove([path]);
    await supabase.from('attachments').delete().eq('id', id);

    attachments.value = attachments.value.filter(a => a.id !== id);
    toast.success('Anexo removido!');
  }

  /* ----------------------------------------
   * DELETE TASK
   * ------------------------------------- */
  async function deleteTask(id: string) {
    if (!isValidUUID(id)) return;

    const { error: err } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (err) {
      toast.error('Erro ao excluir tarefa');
      return;
    }

    tasks.value = tasks.value.filter(t => t.id !== id);
    if (currentTask.value?.id === id) currentTask.value = null;

    toast.success('Tarefa excluída!');
  }

  /* ----------------------------------------
   * RESET
   * ------------------------------------- */
  function reset() {
    tasks.value = [];
    currentTask.value = null;
    comments.value = [];
    attachments.value = [];
    loading.value = false;
    error.value = null;
  }

  return {
    tasks,
    currentTask,
    comments,
    attachments,
    loading,
    error,
    projectTasks,
    tasksByStatus,
    fetchProjectTasks,
    fetchTaskById,
    addComment,
    deleteComment,
    uploadAttachment,
    deleteAttachment,
    deleteTask,
    reset
  };
});
