import { IsOptional, IsString, IsInt, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

export class GetUserTasksDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsInt({ message: "Limit must be a number" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(50, { message: "Limit cannot exceed 50" })
  limit?: number;
}
