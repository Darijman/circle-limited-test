import { IsString, IsOptional, MaxLength, IsEnum, IsNumber } from "class-validator";
import { Transform } from "class-transformer";
import { TaskStatus } from "@prisma/client";

export class UpdateTaskDto {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: "Title must be a string" })
  @IsOptional()
  @MaxLength(255, { message: "Title is too long" })
  title?: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  @MaxLength(1000, { message: "Description is too long" })
  description?: string;

  @IsEnum(TaskStatus, { message: "Invalid status value" })
  @IsOptional()
  status?: TaskStatus;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Order must be a number" })
  @IsOptional()
  order?: number;
}
