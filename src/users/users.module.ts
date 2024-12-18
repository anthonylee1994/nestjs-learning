import {forwardRef, Module} from "@nestjs/common";
import {UsersController} from "./users.controller";
import {UsersService} from "./providers/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UsersCreateManyProvider} from "./providers/users-create-many.provider";
import {AuthModule} from "../auth/auth.module";
import {CreateUserProvider} from "./providers/create-user.provider";
import {FindOneUserByEmailProvider} from "./providers/find-one-user-by-email.provider";
import {ConfigModule} from "@nestjs/config";
import jwtConfig from "../auth/config/jwt.config";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersCreateManyProvider, CreateUserProvider, FindOneUserByEmailProvider],
    exports: [UsersService],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())],
})
export class UsersModule {}
