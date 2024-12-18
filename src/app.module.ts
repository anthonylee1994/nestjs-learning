import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import {PostsModule} from "./posts/posts.module";
import {AuthModule} from "./auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TagsModule} from "./tags/tags.module";
import {MetaOptionsModule} from "./meta-options/meta-options.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PaginationModule} from "./common/pagination/pagination.module";
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import environmentValidation from "./config/environment.validation";

const ENV = process.env.NODE_ENV || "development";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: !ENV ? ".env" : `.env.${ENV}`,
            load: [appConfig, databaseConfig],
            validationSchema: environmentValidation,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("database.host"),
                port: configService.get("database.port"),
                username: configService.get("database.user"),
                password: configService.get("database.password"),
                database: configService.get("database.name"),
                autoLoadEntities: configService.get("database.autoLoadEntities"),
                synchronize: configService.get("database.synchronize"),
            }),
        }),
        UsersModule,
        PostsModule,
        AuthModule,
        TagsModule,
        MetaOptionsModule,
        PaginationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
