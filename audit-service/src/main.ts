import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'audit-consumer' }, // Grupo único para que reciba copia de todo
    },
  });

  await app.startAllMicroservices();
  
  await app.listen(3012); 
  console.log('🚀 Audit Service listening on port 3012');
}

bootstrap();