import { Body, Controller, HttpStatus, Inject, Post, Res } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import { Response } from "express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenDto, TokenPairDto } from "./tokens/tokens.dto";
import { IAuthService } from "./auth.service.interface";
import { MongoTransactionAuthDecorator } from "./auth.service.decorators";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  private readonly _authService: IAuthService;

  constructor(@InjectConnection() private readonly _mongoConnection: Connection,
              @Inject(IAuthService) authService: IAuthService) {
    this._authService = new MongoTransactionAuthDecorator(authService, _mongoConnection);
  }

  @Post("/register")
  @ApiOperation({
    summary: "Register new user."
  })
  @ApiResponse({
    status: 201,
    description: "The user was created successfully",
    type: TokenPairDto
  })
  @ApiResponse({ status: 400, description: "Some validation error" })
  @ApiResponse({ status: 500, description: "Unexpected server error" })
  async register(@Body() userDto: RegisterUserDto, @Res() res: Response) {
    let tokenPair: TokenPairDto = await this._authService.registerUser(userDto);

    return res.status(HttpStatus.CREATED).send(tokenPair);
  }

  @Post("/login")
  @ApiOperation({
    summary: "Login user."
  })
  @ApiResponse({
    status: 200,
    description: "The login was successful",
    type: TokenPairDto
  })
  @ApiResponse({ status: 400, description: "Some validation error" })
  @ApiResponse({ status: 404, description: "Some data was not found" })
  @ApiResponse({ status: 500, description: "Unexpected server error" })
  async login(@Body() userDto: LoginUserDto, @Res() res: Response) {
    let tokenPair: TokenPairDto = await this._authService.loginUser(userDto);

    return res.status(HttpStatus.OK).send(tokenPair);
  }

  @Post("/refresh")
  @ApiOperation({
    summary: "Refresh tokens",
    description: "After some time access tokens will be expired and you can refresh the pair of tokens using refresh token."
  })
  @ApiResponse({
    status: 200,
    description: "Tokens were refreshed successfully",
    type: TokenPairDto
  })
  @ApiResponse({ status: 400, description: "Some validation error" })
  @ApiResponse({ status: 404, description: "Token was not found" })
  @ApiResponse({ status: 500, description: "Unexpected server error" })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
    let tokenPair: TokenPairDto = await this._authService.refreshToken(refreshTokenDto);

    return res.status(HttpStatus.OK).send(tokenPair);
  }
}