
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'notification-consumer' },
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  await app.startAllMicroservices();
  const port = process.env.PORT || 3006; // Puerto diferente
  await app.listen(port);
  Logger.log(` Notification Service is running on port: ${port}`);
}

bootstrap();
