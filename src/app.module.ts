import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { DatabaseConfigService } from "./database/database.config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DatabaseConfigModule } from "./database/database.module";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env"
        }),
        DatabaseConfigModule,
        MongooseModule.forRootAsync({
            inject: [DatabaseConfigService],
            useFactory: async (configService: DatabaseConfigService) => configService.getMongoConfig()
        }),
        ServeStaticModule.forRoot({
            rootPath: resolve(__dirname, "uploads"),
            serveRoot: "/uploads"
        }),
        AuthModule,
        UsersModule
    ]
})
export class AppModule {
}
