import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import {PostsModule} from "./posts/posts.module";
import {AuthModule} from "./auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TagsModule} from "./tags/tags.module";
import {MetaOptionsModule} from "./meta-options/meta-options.module";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [],
            inject: [],
            useFactory: () => ({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: "",
                database: "nestjs_learning",
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        UsersModule,
        PostsModule,
        AuthModule,
        TagsModule,
        MetaOptionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
