import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class RegisterDto {
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: "Invalid email format" })
  @MaxLength(255, { message: "Email is too long" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  @MaxLength(100, { message: "Password is too long" })
  @IsNotEmpty({ message: "Password is required" })
  @Matches(/^[^\s]+$/, { message: "Password must not contain spaces" })
  password: string;
}
