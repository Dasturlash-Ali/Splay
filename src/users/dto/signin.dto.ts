import { 
    IsEmail, 
    IsString
} from "class-validator";


export class UserSignInDto{
    @IsEmail()
    readonly email:string;

    @IsString()
    readonly password:string;

}
