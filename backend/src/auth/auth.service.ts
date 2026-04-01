import { Injectable, UnauthorizedException, BadRequestException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./types/auth-response";
import { JwtPayload } from "./types/jwt-payload";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { email, password } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return this.generateToken(user.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        this.logger.warn(`Register failed: email already exists`);
        throw new BadRequestException("User already exists");
      }

      this.logger.error(`Register error`, error.stack);
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    const passwordToCompare = user?.password ?? "$2b$10$invalidsaltinvalidsaltinv.uZ0X9e";
    const isMatch = await bcrypt.compare(password, passwordToCompare);

    if (!user || !isMatch) {
      throw new UnauthorizedException("Incorrect login or password");
    }
    return this.generateToken(user.id);
  }

  private async generateToken(userId: string): Promise<AuthResponse> {
    const payload: JwtPayload = { id: userId };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }
}
