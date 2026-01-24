import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceTicket } from './entities/maintenance.entity';

@Injectable()
export class MaintenanceService {

  constructor(
    @InjectRepository(MaintenanceTicket)
    private readonly ticketRepo: Repository<MaintenanceTicket>,
  ) {}

  async createTicketFromAlert(alert: any) {
    const ticket = this.ticketRepo.create({
      loanId: alert.loanId,
      description: alert.reason,
      severity: alert.severity,
      status: 'PENDING',
    });

    const savedTicket = await this.ticketRepo.save(ticket);
    console.log(`✅ Ticket de mantenimiento creado con ID: ${savedTicket.id}`);
    return savedTicket;
  }

  findAll() {
    return `This action returns all maintenance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maintenance`;
  }

  update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    return `This action updates a #${id} maintenance`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintenance`;
  }
}
