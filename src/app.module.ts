import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { DatabaseConfigService } from "./database/database.config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env"
    }),
    MongooseModule.forRootAsync({
      inject: [DatabaseConfigService],
      useFactory: async (configService: DatabaseConfigService) => configService.getMongoConfig()
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "uploads"),
      serveRoot: "/uploads"
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
