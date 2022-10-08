import { IAuthService } from "./auth.service.interface";
import { Connection } from "mongoose";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import { RefreshTokenDto, TokenPairDto } from "./tokens/tokens.dto";
import { InjectConnection } from "@nestjs/mongoose";

abstract class BaseAuthServiceDecorator implements IAuthService {
    protected readonly _wrappedService: IAuthService;

    public constructor(authService: IAuthService) {
        this._wrappedService = authService;
    }

    abstract login(userDto: LoginUserDto): Promise<TokenPairDto>

    abstract refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto>

    abstract register(userDto: RegisterUserDto): Promise<TokenPairDto>;

    abstract logout(refreshTokenDto: RefreshTokenDto): Promise<void>;

}

export class MongoTransactionAuthDecorator extends BaseAuthServiceDecorator {
    public constructor(authService: IAuthService,
                       @InjectConnection() private readonly _mongoConnection: Connection) {
        super(authService);
    }

    async login(userDto: LoginUserDto): Promise<TokenPairDto> {
        return await this._wrappedService.login(userDto);
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto> {
        let refreshedTokens: TokenPairDto;
        await this._mongoConnection.startSession()
            .then(async (clientSession) => {
                await clientSession.withTransaction(async () => {
                    refreshedTokens = await this._wrappedService.refreshTokens(refreshTokenDto);
                });
                await clientSession.endSession();
            });

        return refreshedTokens;
    }

    async register(userDto: RegisterUserDto): Promise<TokenPairDto> {
        let createdTokens: TokenPairDto;
        await this._mongoConnection.startSession()
            .then(async (clientSession) => {
                await clientSession.withTransaction(async () => {
                    createdTokens = await this._wrappedService.register(userDto);
                });
                await clientSession.endSession();
            });

        return createdTokens;
    }

    async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
        await this._mongoConnection.startSession()
            .then(async (clientSession) => {
                await clientSession.withTransaction(async () => {
                    await this._wrappedService.logout(refreshTokenDto);
                });
                await clientSession.endSession();
            });
    }
}