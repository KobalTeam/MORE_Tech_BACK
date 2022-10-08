import { Module } from "@nestjs/common";
import { User, UserSchema } from "./users.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [],
  providers: [],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  exports: []
})
export class UsersModule {
}
