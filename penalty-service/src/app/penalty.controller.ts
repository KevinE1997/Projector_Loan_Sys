import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @EventPattern('maintenance.alert')
  async handleDamageAlert(@Payload() data: any) {
    const alert = typeof data === 'string' ? JSON.parse(data) : data;
    await this.penaltyService.createDamagePenalty(alert);
  }

  @Post()
  create(@Body() createPenaltyDto: CreatePenaltyDto) {
    return this.penaltyService.create(createPenaltyDto);
  }

  @Get()
  findAll() {
    return this.penaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penaltyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePenaltyDto: UpdatePenaltyDto) {
    return this.penaltyService.update(+id, updatePenaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.penaltyService.remove(+id);
  }
}
