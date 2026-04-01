import type { CreateTaskDto, GetTasksResponse, Task, UpdateTaskDto } from "../types/task.types";
import { api } from "./axios";

export const getTasks = () => api.get<GetTasksResponse>("/tasks");

export const createTask = (data: CreateTaskDto) => api.post<Task>("/tasks", data);

export const updateTask = (id: string, data: UpdateTaskDto) => api.patch<Task>(`/tasks/${id}`, data);

export const deleteTask = (id: string) => api.delete<boolean>(`/tasks/${id}`);
