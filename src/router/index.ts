import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/supabase';

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// Views
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ProjectsView from '@/views/projects/ProjectsView.vue';
import ProjectDetailView from '@/views/projects/ProjectDetailView.vue';
import TasksView from '@/views/tasks/TasksView.vue';
import TaskDetailView from '@/views/tasks/TaskDetailView.vue';
import ProfileView from '@/views/profile/ProfileView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectsView,
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: ProjectDetailView,
        props: true,
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: TasksView,
      },
      {
        path: 'tasks/:id',
        name: 'task-detail',
        component: TaskDetailView,
        props: true,
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileView,
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginView,
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !session) {
    next({ name: 'login' });
  } else if (requiresGuest && session) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
