export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'admin' | 'user';
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  created_by: string;
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  user?: User;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  project_id: string;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  assignee?: User;
  creator?: User;
}

export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Attachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  task_id: string;
  uploaded_by: string;
  created_at: string;
  uploader?: User;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'project_invitation' | 'mention';
  content: string;
  user_id: string;
  read: boolean;
  created_at: string;
  related_project_id: string | null;
  related_task_id: string | null;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'active' | 'completed' | 'archived';
export type ProjectMemberRole = 'owner' | 'editor' | 'viewer';
export type UserRole = 'admin' | 'user';
export type NotificationType = 'task_assigned' | 'task_updated' | 'comment_added' | 'project_invitation' | 'mention';
