import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../users/users.schema";
import { Model } from "mongoose";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import { IAuthService } from "./auth.service.interface";
import { RefreshJwtTokenPayload, RefreshTokenDto, TokenPairDto } from "./tokens/tokens.dto";
import { IUsersHelper } from "../users/users.helper.interface";
import { ITokensHelper } from "./tokens/tokens.helper.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @InjectModel(User.name) private readonly _userModel: Model<User>,
        @Inject(IUsersHelper) private readonly _usersHelper: IUsersHelper,
        @Inject(ITokensHelper) private readonly _tokensHelper: ITokensHelper,
        private _jwtService: JwtService
    ) {
    }

    async login(userDto: LoginUserDto): Promise<TokenPairDto> {
        let user = await this._usersHelper.getUserByEmail(userDto.email);
        if (!user) {
            throw new NotFoundException("Login is incorrect");
        }

        if (!this._usersHelper.isPasswordValid(user, userDto.password)) {
            throw new NotFoundException("Password is incorrect");
        }

        return await this.generateTokenPair(user);
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto> {
        if (!await this._tokensHelper.isRefreshTokenValid(refreshTokenDto)) {
            throw new UnauthorizedException({ message: "Token is incorrect" });
        }

        let oldSessionId = (this._jwtService.decode(refreshTokenDto.refreshToken) as RefreshJwtTokenPayload).sessionId;
        let user = await this._usersHelper.getUserBySessionId(oldSessionId);
        if (!user) {
            throw new UnauthorizedException({ message: "Token is incorrect" });
        }

        await this._usersHelper.removeSessionId(user, oldSessionId);

        return await this.generateTokenPair(user);
    }

    async register(userDto: RegisterUserDto): Promise<TokenPairDto> {
        let user = await this._usersHelper.getUserByEmail(userDto.email);
        if (user) {
            throw new BadRequestException("User with this email already exists");
        }

        user = await this._usersHelper.getUserByUsername(userDto.username);
        if (user) {
            throw new BadRequestException("User with this username already exists");
        }

        user = new this._userModel({
            username: userDto.username,
            email: userDto.email
        });
        this._usersHelper.setPassword(user, userDto.password);
        user = await user.save();

        return await this.generateTokenPair(user);
    }

    private async generateTokenPair(user: User): Promise<TokenPairDto> {
        let tokenPair: TokenPairDto = new TokenPairDto();

        let promises = [];

        let newSessionId = this._tokensHelper.generateSessionId();
        promises.push(this._usersHelper.addSessionId(user, newSessionId));

        promises.push(this._tokensHelper.generateTokens(user, newSessionId));

        await Promise.all(promises).then((values) => {
            tokenPair.accessToken = values[1][0];
            tokenPair.refreshToken = values[1][1];
        });

        return tokenPair;
    }

    async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
        if (!await this._tokensHelper.isRefreshTokenValid(refreshTokenDto)) {
            throw new UnauthorizedException({ message: "Token is incorrect" });
        }

        let oldSessionId = (this._jwtService.decode(refreshTokenDto.refreshToken) as RefreshJwtTokenPayload).sessionId;
        let user = await this._usersHelper.getUserBySessionId(oldSessionId);
        if (!user) {
            throw new UnauthorizedException({ message: "Token is incorrect" });
        }

        await this._usersHelper.removeSessionId(user, oldSessionId);
    }
}