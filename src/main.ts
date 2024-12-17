import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder} from "@nestjs/swagger";
import {SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}));

    // swagger config
    const config = new DocumentBuilder()
        .setTitle("NestJS Learning")
        .setDescription("NestJS Learning API Documentation")
        .setLicense("MIT", "https://github.com/nestjs/nest/blob/master/LICENSE")
        .setVersion("1.0")
        .addServer("http://localhost:3000")
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
}

bootstrap();
