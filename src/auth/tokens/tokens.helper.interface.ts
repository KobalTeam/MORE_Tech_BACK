import { User } from "../../users/users.schema";
import { RefreshTokenDto } from "./tokens.dto";

export interface ITokensHelper {
    generateRefreshToken(user: User, sessionId: string): Promise<string>

    generateAccessToken(user: User): Promise<string>

    generateSessionId(): string

    isRefreshTokenValid(refreshTokenDto: RefreshTokenDto): Promise<boolean>

    generateTokens(user: User, sessionId:string): Promise<[string, string]>
}

export const ITokensHelper = Symbol("ITokensHelper");