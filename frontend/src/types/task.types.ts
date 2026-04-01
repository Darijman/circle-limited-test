export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetTasksResponse {
  data: Task[];
  nextCursor: string | null;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatusType;
  order?: number;
}
