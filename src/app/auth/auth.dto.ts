import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  email: string;
  password: string;
}
export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString({
    message:"Username is Required"
  })
  username: string;
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
}
