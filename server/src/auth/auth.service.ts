import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(params: { email: string; password: string; name?: string }): Promise<{ token: string }>
  {
    const exists = await this.prisma.user.findUnique({ where: { email: params.email } });
    if (exists) throw new BadRequestException('Email already in use');
    const passwordHash = await argon2.hash(params.password);
    const user = await this.prisma.user.create({ data: { email: params.email, passwordHash, name: params.name ?? null } });
    const token = await this.signToken(user.id);
    return { token };
  }

  async login(params: { email: string; password: string }): Promise<{ token: string }>
  {
    const user = await this.prisma.user.findUnique({ where: { email: params.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, params.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.signToken(user.id);
    return { token };
  }

  private async signToken(userId: string): Promise<string> {
    return this.jwt.signAsync({ sub: userId });
  }
}
