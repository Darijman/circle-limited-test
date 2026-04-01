import { Body, Controller, Post, Get, UseGuards, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./types/auth-response";
import { JwtPayload } from "./types/jwt-payload";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AuthGuard } from "./auth.guard";
import { Public } from "src/common/decorators/public.decorator";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const result = await this.authService.register(dto);
    this.setCookie(res, result.access_token);
    return result;
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponse> {
    const result = await this.authService.login(dto);
    this.setCookie(res, result.access_token);
    return result;
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@CurrentUser() user: JwtPayload) {
    return user;
  }

  private setCookie(res: Response, token: string) {
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });
  }
}
