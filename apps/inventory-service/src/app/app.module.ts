import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectorsModule } from './projectors/projectors.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    // 1. Load environment variables (.env) globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configure database connection (Async to ensure .env is loaded first)
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
        // AutoLoadEntities: Automatically loads entities that you register in modules
        autoLoadEntities: true,
        // Synchronize: TRUE only in development (creates tables automatically)
        synchronize: true,
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule], // 1. Importar ConfigModule
      inject: [ConfigService], // 2. Inyectar ConfigService
      useFactory: async (configService: ConfigService) => ({ // 3. Usarlo
        store: await redisStore({
          socket: {
            // 4. Leer variable de entorno, o usar localhost si falla
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
          },
          ttl: 10 * 1000,
        }),
      }),
    }),

    ProjectorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }