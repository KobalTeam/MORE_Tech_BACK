import { RefreshTokenDto, TokenPairDto } from "./tokens/tokens.dto";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";

export interface IAuthService {
    register(userDto: RegisterUserDto): Promise<TokenPairDto>,

    login(userDto: LoginUserDto): Promise<TokenPairDto>,

    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto>,

    logout(refreshTokenDto: RefreshTokenDto): Promise<void>
}

export const IAuthService = Symbol("IAuthService");