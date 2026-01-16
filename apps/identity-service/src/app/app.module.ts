import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { User } from './entities/user.entity';

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
        // AutoLoadEntities: Automatically loads entities that you register in modules
        autoLoadEntities: true, 
        // Synchronize: TRUE only in development (creates tables automatically)
        synchronize: true, 
      }),
    }),

    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}