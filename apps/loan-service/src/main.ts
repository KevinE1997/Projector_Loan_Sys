import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Loan Service')
    .setDescription('Microservicio encargado de la gestión de préstamos')
    .setVersion('1.0')
    .addTag('Loans')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  const port = process.env.PORT || 3004;
  await app.listen(port);
  
  Logger.log(`🚀 Inventory running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();