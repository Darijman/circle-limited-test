import { TaskStatus } from "@prisma/client";

export interface TaskUpdatedEvent {
  id: string;
  status: TaskStatus;
  order: number;
  timestamp: string;
}
