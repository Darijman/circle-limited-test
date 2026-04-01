import { Module } from "@nestjs/common";
import { TasksGateway } from "./tasks/tasks.gateway";
import { TasksEmitter } from "./tasks/emitters/tasks.emitter";

@Module({
  providers: [TasksGateway, TasksEmitter],
  exports: [TasksEmitter],
})
export class RealtimeModule {}
