import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('loan.created')
  async handleLoanCreated(@Payload() data: any) {
    const loan = typeof data === 'string' ? JSON.parse(data) : data;
    console.log('📧 Generando notificación para préstamo:', loan.id);
    
    await this.notificationsService.create({
      userId: loan.userId,
      type: 'LOAN_CREATED',
      message: `Tu préstamo para el proyector ${loan.projectorId} ha sido registrado exitosamente.`,
    });
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
