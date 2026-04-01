import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { TaskUpdatedEvent } from "./events/task-updated.event";
import { TaskDeletedEvent } from "./events/task-deleted.event";

export const TaskEvents = {
  UPDATED: "task.updated",
  DELETED: "task.deleted",
} as const;

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  emitTaskUpdated(event: TaskUpdatedEvent) {
    this.server.emit(TaskEvents.UPDATED, event);
  }

  emitTaskDeleted(event: TaskDeletedEvent) {
    this.server.emit(TaskEvents.DELETED, event);
  }
}
