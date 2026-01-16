import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [LoansController],
  providers: [LoansService],
  imports: [TypeOrmModule.forFeature([Loan])],
  
})
export class LoansModule {}
