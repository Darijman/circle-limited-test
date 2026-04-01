import { TaskStatus } from "@prisma/client";

export interface TaskUpdatedEvent {
  id: string;
  status: TaskStatus;
  timestamp: string;
}
