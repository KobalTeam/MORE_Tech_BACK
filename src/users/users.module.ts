import { Module } from "@nestjs/common";
import { User, UserSchema } from "./users.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { IUsersHelper } from "./users.helper.interface";
import { UsersHelper } from "./users.helper";

@Module({
    controllers: [],
    providers: [{
        provide: IUsersHelper,
        useClass: UsersHelper
    }],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ])
    ],
    exports: [{
        provide: IUsersHelper,
        useClass: UsersHelper
    }]
})
export class UsersModule {
}
