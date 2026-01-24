import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <--- Importar esto
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FeedbackModule } from './feedback.module';

@Module({
  imports: [
    // 1. Cargar Variables de Entorno (Global para que funcione en todos lados)
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', // Busca el archivo .env en la raíz del proyecto
    }),

    // 2. Base de Datos (Configuración Dinámica)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: true, // Ojo: En producción esto debería ser false
      }),
    }),

    FeedbackModule,
  ],
})
export class AppModule {}