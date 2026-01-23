import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';
import { LoanStatus } from './entities/loan.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoansService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    // Inject the Kafka client defined in the module
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    private readonly httpService: HttpService,
  ) { }



  async create(createLoanDto: CreateLoanDto) {
    // --- SYNCHRONOUS VALIDATION (HTTP) ---
    const { projectorId } = createLoanDto;
    let projector;

    try {
      const inventoryUrl = this.configService.get<string>('INVENTORY_SERVICE_URL');
      // 1. Ask Inventory Service if the projector exists
      // Note: We use localhost:3002 because we run locally. In production we would use environment variables.
      const response = await firstValueFrom(
        this.httpService.get(`${inventoryUrl}/projectors/${projectorId}`)
      );
      projector = response.data;
    } catch (error) {
      // If Inventory responds with 404 or connection fails
      throw new NotFoundException(`Projector with ID ${projectorId} does not exist or the inventory service is not responding.`);
    }

    // 2. Verify if it is available
    if (projector.status !== 'AVAILABLE') {
      throw new BadRequestException(`Projector ${projector.brand} is not available (Status: ${projector.status})`);
    }
    // ----------------------------------

    // 3. If it passes validations, we proceed normally
    const newLoan = this.loanRepository.create(createLoanDto);
    const savedLoan = await this.loanRepository.save(newLoan);

    this.kafkaClient.emit('loan.created', JSON.stringify(savedLoan));

    return savedLoan;
  }



  async returnLoan(loanId: string) {
    // Find the loan
    const loan = await this.loanRepository.findOneBy({ id: loanId });

    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.status === LoanStatus.RETURNED) {
      throw new Error('This loan has already been returned');
    }

    // Update loan data
    loan.status = LoanStatus.RETURNED;
    loan.returnDate = new Date(); // Current date and time

    const savedLoan = await this.loanRepository.save(loan);

    // Emit event to Kafka to release the projector
    // Send the projectorId so inventory service knows which projector to release
    this.kafkaClient.emit('loan.returned', { projectorId: loan.projectorId });

    return savedLoan;
  }

  findAll() {
    return this.loanRepository.find();
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
