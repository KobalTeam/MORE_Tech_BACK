import { IUsersHelper } from "./users.helper.interface";
import { User } from "./users.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { pbkdf2Sync, randomBytes } from "crypto";

@Injectable()
export class UsersHelper implements IUsersHelper {
    constructor(@InjectModel(User.name) private readonly _userModel: Model<User>) {
    }

    async getUserById(id: string): Promise<User> {
        return await this._userModel.findById(id).exec();
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this._userModel.findOne({ "email": email }).exec();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this._userModel.findOne({ "username": username }).exec();
    }

    async getUserByRefreshToken(token: string): Promise<User> {
        return await this._userModel.findOne({ "refreshToken": token }).exec();
    }

    setPassword(user: User, password: string): void {
        user.salt = randomBytes(16).toString("hex");
        user.password = pbkdf2Sync(password, user.salt, 100, 512, "sha512").toString("hex");
    };

    isPasswordValid(user: User, password: string): boolean {
        let hash = pbkdf2Sync(password, user.salt, 100, 512, "sha512").toString("hex");
        return user.password === hash;
    };

    async getUserBySessionId(sessionId: string): Promise<User> {
        return await this._userModel.findOne({ "sessionIds": sessionId }).exec();
    }

    async addSessionId(user: User, sessionId): Promise<User> {
        user.sessionIds.push(sessionId);

        return await user.save();
    }

    async removeSessionId(user: User, sessionId): Promise<User> {
        user.sessionIds = user.sessionIds.filter(item => item !== sessionId);

        return await user.save();
    }
}