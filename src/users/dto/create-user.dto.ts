import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
  }

export class CreateUserDto {
    @IsEmail()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    readonly  password: string

    @IsString()
    @IsNotEmpty()
    readonly confirm_password: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly age : number
    
    @ApiProperty()
    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender : string
}
