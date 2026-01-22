import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // 1. Escuchar cuando se crea un préstamo
  @EventPattern('loan.created')
  handleLoanCreated(@Payload() data: any) {
    this.auditService.logEvent('loan.created', data);
  }

  // 2. Escuchar cuando hay alerta de mantenimiento
  @EventPattern('maintenance.alert')
  handleMaintenanceAlert(@Payload() data: any) {
    this.auditService.logEvent('maintenance.alert', data);
  }

  @Post()
  create(@Body() createAuditDto: CreateAuditDto) {
    return this.auditService.create(createAuditDto);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }
}
