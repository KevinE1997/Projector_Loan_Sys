import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardGateway } from './dashboard.gateway'; // <--- Importar

@Module({
  imports: [
    // No necesitamos DB aquí, solo Kafka y WebSockets
  ],
  controllers: [AppController],
  providers: [AppService, DashboardGateway], // <--- Registrar Gateway como Provider
})
export class AppModule {}