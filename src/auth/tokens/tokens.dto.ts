import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({
        description: "Some refresh token from login or register's response"
    })
    @IsNotEmpty()
    refreshToken: string;
}

export class TokenPairDto extends RefreshTokenDto {
    @ApiProperty()
    accessToken: string;
}

export class AccessJwtTokenPayload {
    id: string;
    username: string;
}

export class RefreshJwtTokenPayload {
    id: string;
    username: string;
    sessionId: string;
}