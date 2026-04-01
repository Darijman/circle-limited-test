import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { GetUserTasksDto } from "./dto/get-user-tasks.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtPayload } from "src/auth/types/jwt-payload";
import { AuthGuard } from "src/auth/auth.guard";
import { GetUserTasksResponse } from "./types/get-user-tasks.response";
import { TaskResponse } from "./types/task.response";

@UseGuards(AuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getUserTasks(@CurrentUser() user: JwtPayload, @Query() dto: GetUserTasksDto): Promise<GetUserTasksResponse> {
    return await this.tasksService.getUserTasks(user.id, dto);
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateTaskDto): Promise<TaskResponse> {
    return await this.tasksService.create(user.id, dto);
  }

  @Get(":id")
  async getTaskById(@CurrentUser() user: JwtPayload, @Param("id") id: string): Promise<TaskResponse> {
    return await this.tasksService.getTaskById(user.id, id);
  }

  @Patch(":id")
  async updateById(@CurrentUser() user: JwtPayload, @Param("id") id: string, @Body() dto: UpdateTaskDto): Promise<TaskResponse> {
    return await this.tasksService.updateById(user.id, id, dto);
  }

  @Delete(":id")
  async removeById(@CurrentUser() user: JwtPayload, @Param("id") id: string): Promise<boolean> {
    return await this.tasksService.removeById(user.id, id);
  }
}
