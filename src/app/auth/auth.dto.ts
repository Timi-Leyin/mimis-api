import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString({
    message: 'Password is Required',
  })
  password: string;
}
export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString({
    message: 'Username is Required',
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

export class CheckUserDto {
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}
