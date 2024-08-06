import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import {getEnv} from "./utils/getenv";


async function startApp() {
    const appPort = getEnv('PORT', 3000);
    const app = await NestFactory.create(AppModule, {cors: true});

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    const options = new DocumentBuilder()
        .setTitle('Todo API Documentation')
        .setDescription('The Todo API description')
        .setVersion('1.0.0')
        .addTag('todo')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/swagger', app, document);

    await app.listen(appPort, () => console.log(`Server started on port` + appPort));

}
startApp()