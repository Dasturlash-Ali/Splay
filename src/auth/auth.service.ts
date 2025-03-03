import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserSignInDto } from '../users/dto/signin.dto';
import { Response } from 'express';
import * as bcrypt from "bcrypt"
import { AdminSignInDto, CreateAdminDto } from '../admin/dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async getTokens(user: User){
    const payload = {
      id: user.id,
      email: user.email,
    };

    const[accessToken, refreshToken ] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async signUp(createUserDto: CreateUserDto){
    const condidate = await this.userService.findOneByEmail(
      createUserDto.email
    );

    if(condidate){
      throw new BadRequestException("Bunday foydalanuvchi mavjud");
    }

    const newUser = await this.userService.create(createUserDto)

    const response = {
      message:
      "Siz tizimga qo'shildingiz. Akauntni faollashtirish uchun emailingizga xat yuborildi!!!",
      userId: newUser.id
    };
    
    return response;
  }

  async signIn(signInDto: UserSignInDto, res: Response){
    const { email, password } = signInDto;
    const user = await this.userService.findOneByEmail(email)
    if(!user){
      throw new BadRequestException("User topilmadi");
    }

    const isMatchPass = await bcrypt.compare(password, user.hash_password);

    if(!isMatchPass){
      throw new BadRequestException("Password do not match");
    }
    const tokens = await this.getTokens(user)

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateUser = await this.userService.updateRefreshToken(
      user.id,
      hashed_refresh_token,
    );

    if(!updateUser){
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    const response = {
      message: "User logged in",
      userId: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response){
    const userData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
    });
    if(!userData){
        throw new ForbiddenException("User not verified");
    }
    const hashed_refresh_token = null;
    await this.userService.updateRefreshToken(
        userData.id,
        hashed_refresh_token
    );

    res.clearCookie("refresh_token");
    const response = {
        message: "User logged use succesfully",
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response){
    const decodedToken = await this.jwtService.decode(refreshToken);

    if(userId != decodedToken["id"]){
        throw new BadRequestException("Ruxsat etilmagan");
    }
    const user = await this.userService.findOne(+userId);

    if(!user || !user.hashedToken){
        throw new BadRequestException("user not found");
    }

    const tokenMatch = await bcrypt.compare(
        refreshToken,
        user.hashedToken
    );

    if(!tokenMatch){
        throw new ForbiddenException("Forbidden");
    }

    const tokens = await this.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.userService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true,
    });

    const response = {
        message: "User refreshed",
        user: user.id,
        access_token: tokens.access_token,
    };

    return response;
  }

  async adminSignUp(createAdminDto: CreateAdminDto) {
    const condiate = await this.adminService.findByEmail(createAdminDto.email);
    if (condiate) {
        throw new BadRequestException("Bunday Admin mavjud")
    }
    const newAdmin = await this.adminService.create(createAdminDto);

    const response = {
        message: "Tabriklayman tizimga qo'shildingin",
        adminId: newAdmin.id
    }

    return response
  }

  async adminSignIn(adminSignInDto: AdminSignInDto, res: Response) {
        
    const { email, password } = adminSignInDto

    if (!email || !password) {
        throw new BadRequestException()
    }

    const admin = await this.adminService.findByEmail(email)

    if (!admin) {
        throw new UnauthorizedException('Invalid Email or password')
    }
    
    const validPassword = await bcrypt.compare(adminSignInDto.password, admin.hash_password)
    if (!validPassword) {
        throw new UnauthorizedException('Invalid Email or password')
    }

    const tokens = await this.adminService.getToken(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7)

    const updateAdmin = await this.adminService.updateRefreshToken(
        admin.id,
        hashed_refresh_token
    )
    if (!updateAdmin) {
        throw new InternalServerErrorException("Tokenni saqlashda xatolik")
    }
    res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 100,
        httpOnly: true
    })
    const response = {
        message: "Admin logged in",
        adminId: admin.id,
        access_token: tokens.access_token
    };

    return response
  }

  async AdminSignOut(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!adminData) {
        throw new ForbiddenException("Admin not verified");
    }
    const hashed_refresh_token = null;
    await this.adminService.updateRefreshToken(
        adminData.id,
        hashed_refresh_token
    );

    res.clearCookie("refresh_token");

    const response = {
        message: "Admin logged out successfully",
    };
    return response;
  }

  async AdminRefreshToken(id: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (id != decodedToken["id"]) {
        throw new BadRequestException("Ruxsat etilmagan");
    }

    const admin = await this.adminService.findOne(+id);
    if (!admin || !admin.hashed_refresh_token) {
        throw new BadRequestException("Admin not found");
    }

    const tokenMatch = await bcrypt.compare(refreshToken, admin.hashed_refresh_token);

    if (!tokenMatch) {
        throw new ForbiddenException("Forbidden");
    }

    const tokens = await this.adminService.getToken(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    await this.adminService.updateRefreshToken(
        admin.id,
        hashed_refresh_token
    );

    res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 15 * 24 * 60 * 1000,
        httpOnly: true,
    });
    const response = {
        message: "Admin refreshed",
        adminId: admin.id,
        access_token: tokens.access_token,
    };
    return response;
  }
}
