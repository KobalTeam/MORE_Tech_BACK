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

  abstract loginUser(userDto: LoginUserDto): Promise<TokenPairDto>

  abstract refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto>

  abstract registerUser(userDto: RegisterUserDto): Promise<TokenPairDto>;
}

export class MongoTransactionAuthDecorator extends BaseAuthServiceDecorator {
  public constructor(authService: IAuthService,
                     @InjectConnection() private readonly _mongoConnection: Connection) {
    super(authService);
  }

  async loginUser(userDto: LoginUserDto): Promise<TokenPairDto> {
    return await this._wrappedService.loginUser(userDto);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenPairDto> {
    let refreshedTokens: TokenPairDto;
    await this._mongoConnection.startSession()
      .then(async (clientSession) => {
        await clientSession.withTransaction(async () => {
          refreshedTokens = await this._wrappedService.refreshToken(refreshTokenDto);
        });
        await clientSession.endSession();
      });

    return refreshedTokens;
  }

  async registerUser(userDto: RegisterUserDto): Promise<TokenPairDto> {
    let createdTokens: TokenPairDto;
    await this._mongoConnection.startSession()
      .then(async (clientSession) => {
        await clientSession.withTransaction(async () => {
          createdTokens = await this._wrappedService.registerUser(userDto);
        });
        await clientSession.endSession();
      });

    return createdTokens;
  }
}