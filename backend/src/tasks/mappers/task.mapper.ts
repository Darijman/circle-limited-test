import { Task } from "@prisma/client";
import { TaskResponse } from "../types/task.response";

export const toTaskResponse = (task: Task): TaskResponse => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});
