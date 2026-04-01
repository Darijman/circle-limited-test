import { Injectable, NotFoundException, BadRequestException, Logger, ForbiddenException } from "@nestjs/common";
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
    const { cursor, limit } = dto;

    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { order: "desc" },
      take: limit ? limit + 1 : undefined,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const hasNextPage = limit ? tasks.length > limit : false;
    const data = hasNextPage ? tasks.slice(0, -1) : tasks;

    return {
      data: data.map(toTaskResponse),
      nextCursor: hasNextPage && data.length ? data[data.length - 1].id : null,
    };
  }

  async create(userId: string, dto: CreateTaskDto): Promise<TaskResponse> {
    const lastTask = await this.prisma.task.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastTask ? lastTask.order + 1000 : 1000;

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description?.trim() || null,
        userId,
        order: newOrder,
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

    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Task not found");
    }

    if (existing.userId !== userId) {
      this.logger.warn(`Forbidden update attempt: taskId=${id}, userId=${userId}`);
      throw new ForbiddenException("Access denied");
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: dto,
    });

    this.tasksEmitter.emitTaskUpdated(task.id, task.status, task.order);
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
