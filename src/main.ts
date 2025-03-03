import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function start() {
  try {
    const PORT = process.env.PORT ?? 3000
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");

    const config = new DocumentBuilder()
    .setTitle('SPlay project')
    .setDescription('SPlay project REST Api')
    .setVersion('1.0')
    .addTag(
      "NESTJS validation, swagger, guard, sequelize, pg, mailer"
    )
    .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(PORT, () => {
      console.log(`Server stared at: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.log(error);
  }
}

start();