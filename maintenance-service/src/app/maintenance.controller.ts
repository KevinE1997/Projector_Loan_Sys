import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.createTicketFromAlert(createMaintenanceDto);
  }

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(+id, updateMaintenanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(+id);
  }

  @EventPattern('maintenance.alert')
  async handleMaintenanceAlert(@Payload() data: any) {
    // A veces Kafka envía el dato como string, aseguramos que sea JSON
    const alert = typeof data === 'string' ? JSON.parse(data) : data;
    
    console.log('🔧 MANTENIMIENTO: Recibida solicitud de reparación:', alert);

    await this.maintenanceService.createTicketFromAlert(alert);
  }
}
