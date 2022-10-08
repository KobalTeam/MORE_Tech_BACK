import { ITokensHelper } from "./tokens.helper.interface";
import { Injectable } from "@nestjs/common";
import { User } from "../../users/users.schema";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { RefreshTokenDto } from "./tokens.dto";

@Injectable()
export class TokensHelper implements ITokensHelper {
    constructor(
        private _jwtService: JwtService) {
    }

    async generateRefreshToken(user: User, sessionId: string): Promise<string> {
        const payload = { id: user._id, username: user.username, sessionId: sessionId };
        return this._jwtService.sign(payload, {
            secret: process.env.PRIVATE_KEY,
            privateKey: process.env.PRIVATE_KEY,
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        });
    }

    async generateAccessToken(user: User): Promise<string> {
        const payload = { id: user._id, username: user.username };
        return this._jwtService.sign(payload, {
            secret: process.env.PRIVATE_KEY,
            privateKey: process.env.PRIVATE_KEY,
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        });
    }

    generateSessionId(): string {
        return uuidv4();
    }

    async isRefreshTokenValid(refreshTokenDto: RefreshTokenDto): Promise<boolean> {
        try {
            if (await this._jwtService.verifyAsync(refreshTokenDto.refreshToken, { secret: process.env.PRIVATE_KEY }))
                return true;
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return false;
            }
            throw error;
        }
        return false;
    }

    async generateTokens(user: User, sessionId: string): Promise<[string, string]> {
        let tokens: [string, string] = ["", ""];
        let promises = [];

        promises[0] = this.generateAccessToken(user);
        promises[1] = this.generateRefreshToken(user, sessionId);

        await Promise.all(promises).then((values) => {
            tokens[0] = values[0];
            tokens[1] = values[1];
        });
        return tokens;
    }

}