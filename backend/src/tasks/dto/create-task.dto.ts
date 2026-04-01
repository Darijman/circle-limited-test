import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateTaskDto {
  @Transform(({ value }) => value?.trim())
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  @MaxLength(255, { message: "Title is too long" })
  title: string;

  @Transform(({ value }) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  @MaxLength(1000, { message: "Description is too long" })
  description?: string | null;
}
