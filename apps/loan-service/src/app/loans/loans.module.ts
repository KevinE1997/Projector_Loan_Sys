import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', 
      signOptions: { expiresIn: '1h' },
    }),
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
  providers: [LoansService, JwtStrategy],
})
export class LoansModule {}