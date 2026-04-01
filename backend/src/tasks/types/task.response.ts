import { TaskStatus } from "@prisma/client";

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
