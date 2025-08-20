// import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

// export class RegisterDto {
//   @IsEmail() email!: string;
//   @MinLength(6) password!: string;
//   @IsNotEmpty() name!: string;
// }

// export class LoginDto {
//   @IsEmail() email!: string;
//   @MinLength(6) password!: string;
// }



import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
