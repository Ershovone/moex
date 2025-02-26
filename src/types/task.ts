// src/types/task.ts

export interface Task {
  id: string;
  number: string;
  title: string;
  description: string;
  assignee: string;
  author: string;
  priority: TaskPriority;
  category: string;
  createdAt: string;
  dueDate?: string;
  completedDate?: string;
  status: TaskStatus;
  daysLeft?: number;
  url?: string;
  source?: string;
}

export type TaskPriority = "high" | "medium" | "low" | "urgent";
export type TaskStatus = "active" | "completed" | "overdue";

export interface TaskGroup {
  id: string;
  name: string;
  tasks: Task[];
}

export interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onCopy: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export interface TasksFilters {
  search: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
