import { ClientSession } from "mongoose";
import { RefreshTokenDto, TokenPairDto } from "./tokens/tokens.dto";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";

export interface IAuthService {
  registerUser(userDto: RegisterUserDto): Promise<TokenPairDto>,

  loginUser(userDto: LoginUserDto): Promise<TokenPairDto>,

  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto>,
}

export const IAuthService = Symbol("IAuthService");