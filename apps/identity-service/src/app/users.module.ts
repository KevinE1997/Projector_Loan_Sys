import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the entity here
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // We export the service so AuthModule can use it later
})
export class UsersModule {}