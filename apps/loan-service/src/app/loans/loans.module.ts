import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
    // Register the client to connect with Kafka
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT', // Name to inject it later
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Kafka address in Docker
          },
          consumer: {
            groupId: 'loan-consumer', // Consumer group identifier
          },
        },
      },
    ]),
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}