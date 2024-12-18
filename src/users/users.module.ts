import {forwardRef, Module} from "@nestjs/common";
import {UsersController} from "./users.controller";
import {UsersService} from "./providers/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UsersCreateManyProvider} from "./providers/users-create-many.provider";
import {AuthModule} from "../auth/auth.module";
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersCreateManyProvider, CreateUserProvider, FindOneUserByEmailProvider],
    exports: [UsersService],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
})
export class UsersModule {}
