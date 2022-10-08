import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ default: "email@mail.ru" })
  @IsEmail()
  email: string;
  @ApiProperty({ default: "password" })
  @IsNotEmpty()
  password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({ default: "username" })
  @IsNotEmpty()
  username: string;
}
