import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices'; // <--- Import
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create the base application
  const app = await NestFactory.create(AppModule);

  // Connect the Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'inventory-consumer', // Unique group for inventory
      },
    },
  });

  // Normal Swagger and prefix configuration
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const config = new DocumentBuilder()
    .setTitle('Inventory Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start everything
  await app.startAllMicroservices(); // Start Kafka connection
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  Logger.log(`🚀 Inventory Service listening on port ${port} and Kafka`);
}

bootstrap();