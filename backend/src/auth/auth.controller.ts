import { Body, Controller, Post, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./types/auth-response";
import { JwtPayload } from "./types/jwt-payload";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AuthGuard } from "./auth.guard";
import { Public } from "src/common/decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
