import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationsModule } from './notifications.module';

@Module({
  imports: [
    // 1. Conexión a MongoDB (NoSQL)
    MongooseModule.forRoot(
      'mongodb://root:rootpassword@localhost:27017/plms-notifications?authSource=admin',
    ),

    // 2. Cliente Kafka (Para escuchar eventos de Préstamos)
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: { brokers: ['localhost:9092'] },
          consumer: { groupId: 'notification-consumer' }, // Nuevo Group ID
        },
      },
    ]),

    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
