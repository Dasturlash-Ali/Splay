import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaClientService: PrismaService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, confirm_password } = createUserDto;

    if(password !== confirm_password) {
      throw new BadRequestException("Parollar aynan emas")
    }

    const hashedPassword = await bcrypt.hash(password, 7)

    const newUser = await this.prismaClientService.user.create({
      data: {
        email: createUserDto.email,
        hash_password: hashedPassword
        }
    });

    return newUser;
  }

  findAll() {
    return this.prismaClientService.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaClientService.user.findUnique({where: {id}})

    if(!user){
      throw new NotFoundException("Bunday id-li user topilmadi")
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaClientService.user.findUnique({where: {email}});
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id)
    return this.prismaClientService.user.update({
      where: {id},
      data: {...updateUserDto}
    });
  }

  async updateRefreshToken(id: number, hashed_refresh_token:string | null) {
    const updatedUser = await this.prismaClientService.user.update(
      {
        where: {id},
        data: { hashedToken: hashed_refresh_token}
      }
    );
    return updatedUser;
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prismaClientService.user.delete({where: {id}});
  }
}
