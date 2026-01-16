import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: all routes will start with /api (e.g: /api/users)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // --- SWAGGER CONFIGURATION ---
  const config = new DocumentBuilder()
    .setTitle('PLMS Identity Service')
    .setDescription('Authentication and Users Microservice')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  // The documentation will live at /api/docs
  SwaggerModule.setup('api/docs', app, document);
  // --- END CONFIGURATION ---

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📄 Swagger Docs available at: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();