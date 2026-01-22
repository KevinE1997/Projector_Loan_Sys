import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Prefijo API
  app.setGlobalPrefix('api');

  // Conexión Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'penalty-consumer' }, // Grupo único
    },
  });

  await app.startAllMicroservices();
  
  const port = 3016; // Puerto 3016
  await app.listen(port);
  console.log(`🚀 Penalty Service running on port ${port}`);
}

bootstrap();