import { Controller, Post, Body, Param, HttpCode, HttpStatus, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserSignInDto } from '../users/dto/signin.dto';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookie-getter.decorator';
import { ResponseFields } from '../common/types/response.type';
import { AdminSignInDto, CreateAdminDto } from '../admin/dto';
import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { JwtPayloadWidthRefreshToken } from '../common/types/jwt-payload-refresh.type';

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
  ): Promise<ResponseFields>{
    return this.authService.signIn(signInDto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post("signout")
  signout(
    @GetCurrentUserId() userId: number,
    @Res({passthrough:  true}) res: Response
  ): Promise<boolean> {
    return this.authService.signOut(+userId, res)
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @GetCurrentUser() user: JwtPayloadWidthRefreshToken,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields>{
    return this.authService.refreshToken(+userId, refreshToken, res)
  }

  @ApiOperation({ summary: "Yangi admin ro'yxatdan o'tkazish" })
  @Post('admin/sign-up')
  signUpAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.adminSignUp(createAdminDto)
  }
  
  @ApiOperation({ summary: "Admin tizimga kirish" })
  @HttpCode(HttpStatus.OK)
  @Post('admin/sign-in')
  adminSignIn(
    @Body() adminSignInDto: AdminSignInDto,
    @Res({ passthrough: true }) res: Response
  ):Promise<ResponseFields> {
    return this.authService.adminSignIn(adminSignInDto, res)
  }
  
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get("admin/sign-out")
  AdminSignout(
    @GetCurrentUserId() adminId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.AdminSignOut(+adminId, res)
  }
  
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get("admin/:id/refresh")
  AdminRefresh(
    @GetCurrentUserId() adminId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @GetCurrentUser() admin: JwtPayloadWidthRefreshToken,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    console.log(admin);
    
    return this.authService.AdminRefreshToken(+adminId, refreshToken, res)
  }
}
