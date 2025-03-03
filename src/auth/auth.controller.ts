import { Controller, Post, Body, Param, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserSignInDto } from '../users/dto/signin.dto';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookie-getter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "Tizimdan ro'yxatdan o'tish"})
  @HttpCode(HttpStatus.OK)
  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto){
    return this.authService.signUp(createUserDto)
  }

  @ApiOperation({ summary: "Tizimga kirish"})
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signIn(
    @Body() signInDto: UserSignInDto,
    @Res({ passthrough: true}) res:Response
  ){
    return this.authService.signIn(signInDto, res);
  }

  @HttpCode(200)
  @Post("signout")
  signout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({passthrough:  true}) res: Response
  ){
    return this.authService.signOut(refreshToken, res)
  }

  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @Param("id") id: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ){
    return this.authService.refreshToken(id, refreshToken, res)
  }
}
