import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Conectar Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'maintenance-consumer' }, 
    },
  });

  await app.startAllMicroservices();
  const port = 3010; // Puerto 3010
  await app.listen(port);
  console.log(`🚀 Maintenance Service running on port ${port}`);
}

bootstrap();