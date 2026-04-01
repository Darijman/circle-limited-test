import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { AuthModule } from "src/auth/auth.module";
import { RealtimeModule } from "src/realtime/realtime.module";

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
