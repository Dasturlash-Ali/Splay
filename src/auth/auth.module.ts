import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admin/admin.module';
import { AccessTokenStrategy, RefreshTokenCookieStrategy } from '../common/strategies';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({global: true}),
    UsersModule,
    AdminModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService, 
    AccessTokenStrategy, 
    RefreshTokenCookieStrategy],
})
export class AuthModule {}
