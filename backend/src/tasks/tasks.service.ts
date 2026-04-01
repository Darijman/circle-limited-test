import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { GetUserTasksDto } from "./dto/get-user-tasks.dto";
import { GetUserTasksResponse } from "./types/get-user-tasks.response";
import { toTaskResponse } from "./mappers/task.mapper";
import { TaskResponse } from "./types/task.response";
import { TasksEmitter } from "src/realtime/tasks/emitters/tasks.emitter";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksEmitter: TasksEmitter,
  ) {}

  async getUserTasks(userId: string, dto: GetUserTasksDto): Promise<GetUserTasksResponse> {
    const { cursor, limit = 20 } = dto;

    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const hasNextPage = tasks.length > limit;
    const data = hasNextPage ? tasks.slice(0, -1) : tasks;

    return {
      data: data.map(toTaskResponse),
      nextCursor: hasNextPage && data.length ? data[data.length - 1].id : null,
    };
  }

  async create(userId: string, dto: CreateTaskDto): Promise<TaskResponse> {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description?.trim() || null,
        userId,
      },
    });

    return toTaskResponse(task);
  }

  async getTaskById(userId: string, id: string): Promise<TaskResponse> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }
    return toTaskResponse(task);
  }

  async updateById(userId: string, id: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    if (!Object.keys(dto).length) {
      throw new BadRequestException("Empty update");
    }

    const result = await this.prisma.task.updateMany({
      where: { id, userId },
      data: dto,
    });

    if (result.count === 0) {
      this.logger.warn(`Update failed: taskId=${id}`);
      throw new NotFoundException("Task not found");
    }

    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      this.logger.error(`Task missing after update: id=${id}`);
      throw new NotFoundException("Task not found");
    }

    this.tasksEmitter.emitTaskUpdated(task.id, task.status);
    return toTaskResponse(task);
  }

  async removeById(userId: string, id: string): Promise<boolean> {
    const result = await this.prisma.task.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      this.logger.warn(`Delete failed: taskId=${id}`);
      throw new NotFoundException("Task not found");
    }

    this.tasksEmitter.emitTaskDeleted(id);
    return true;
  }
}
