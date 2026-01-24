import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitar CORS para que el Frontend pueda conectarse al Socket
  app.enableCors();

  // 2. Conectar Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'dashboard-consumer' },
    },
  });

  await app.startAllMicroservices();
  
  const port = 3014;
  await app.listen(port);
  console.log(`🚀 Dashboard Service (WebSocket) running on port ${port}`);
}

bootstrap();