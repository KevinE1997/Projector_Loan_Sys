import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Inventory Service')
    .setDescription('Gestión de Proyectores y Activos')
    .setVersion('1.0')
    .addTag('Projectors')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // PORT 3002
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  Logger.log(`🚀 Inventory running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();