import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuditModule } from './audit.module';

@Module({
  imports: [
    // Conexión a MongoDB (misma que notifications)
    MongooseModule.forRoot(
      'mongodb://root:rootpassword@localhost:27017/plms-audit?authSource=admin',
    ),

    // AuditModule será el encargado de la lógica
    AuditModule,
  ],
})
export class AppModule {}
