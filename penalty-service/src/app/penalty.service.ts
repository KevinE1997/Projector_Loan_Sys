import { Injectable } from '@nestjs/common';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Penalty } from './entities/penalty.entity';

@Injectable()
export class PenaltyService {
 
  constructor(
    @InjectRepository(Penalty)
    private readonly penaltyRepo: Repository<Penalty>,
  ) {}

 async createDamagePenalty(data: any) {
    console.log(` Generando multa por DAÑO para el préstamo ${data.loanId}`);
    
    // Lógica simple: Si es grave (HIGH) $50, si no $20
    const amount = data.severity === 'HIGH' ? 50.00 : 20.00;

    const penalty = this.penaltyRepo.create({
      loanId: data.loanId,
      userId: 'user-unknown',
      reason: `Daño de equipo: ${data.description}`,
      amount: amount,
    });

    return this.penaltyRepo.save(penalty);
  }

  create(createPenaltyDto: CreatePenaltyDto) {
    return 'This action adds a new penalty';
  }

  findAll() {
    return this.penaltyRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} penalty`;
  }

  update(id: number, updatePenaltyDto: UpdatePenaltyDto) {
    return `This action updates a #${id} penalty`;
  }

  remove(id: number) {
    return `This action removes a #${id} penalty`;
  }
}
