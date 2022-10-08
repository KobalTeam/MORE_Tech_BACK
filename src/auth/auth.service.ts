import { IAuthService } from "./auth.service.interface";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import { RefreshTokenDto, TokenPairDto } from "./tokens/tokens.dto";


export class AuthService implements IAuthService {
  loginUser(userDto: LoginUserDto): Promise<TokenPairDto> {
    return Promise.resolve(undefined);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto> {
    return Promise.resolve(undefined);
  }

  registerUser(userDto: RegisterUserDto): Promise<TokenPairDto> {
    return Promise.resolve(undefined);
  }

}