import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name?: string }): Promise<{ token: string }>
  {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }): Promise<{ token: string }>
  {
    return this.auth.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: Request): { userId: string }
  {
    return { userId: (req as any).user?.userId as string };
  }
}
