import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    // Inject the client that we defined in the module
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) { }
  async create(createLoanDto: CreateLoanDto) {
    // Save the Loan in local database
    const newLoan = this.loanRepository.create(createLoanDto);
    const savedLoan = await this.loanRepository.save(newLoan);

    // Emit event to Kafka
    this.kafkaClient.emit('loan.created', JSON.stringify(savedLoan));

    return savedLoan;
  }

  findAll() {
    return `This action returns all loans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loan`;
  }

  update(id: number, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }
}
