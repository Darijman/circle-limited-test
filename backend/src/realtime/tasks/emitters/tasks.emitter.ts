import { Injectable } from "@nestjs/common";
import { TasksGateway } from "../tasks.gateway";
import { TaskUpdatedEvent } from "../events/task-updated.event";
import { TaskStatus } from "@prisma/client";
import { TaskDeletedEvent } from "../events/task-deleted.event";

@Injectable()
export class TasksEmitter {
  constructor(private readonly gateway: TasksGateway) {}

  emitTaskUpdated(taskId: string, status: TaskStatus) {
    const event: TaskUpdatedEvent = {
      id: taskId,
      status,
      timestamp: new Date().toISOString(),
    };

    this.gateway.emitTaskUpdated(event);
  }

  emitTaskDeleted(taskId: string) {
    const event: TaskDeletedEvent = {
      id: taskId,
      timestamp: new Date().toISOString(),
    };

    this.gateway.emitTaskDeleted(event);
  }
}
