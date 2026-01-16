import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices'; // <--- Importar
import { ProjectorsService } from './projectors.service';
import { CreateProjectorDto } from './dto/create-projector.dto';

@Controller('projectors')
export class ProjectorsController {
  constructor(private readonly projectorsService: ProjectorsService) {}

  // ... tus endpoints HTTP normales (Post, Get) ...
  @Post()
  create(@Body() createProjectorDto: CreateProjectorDto) {
    return this.projectorsService.create(createProjectorDto);
  }

  @Get()
  findAll() {
    return this.projectorsService.findAll();
  }

  // --- NUEVO: Escuchar evento de Kafka ---
  @EventPattern('loan.created')
  async handleLoanCreated(@Payload() data: any) {
    console.log('Evento recibido en Inventory: loan.created', data);
    
    // Extraemos el ID del proyector del mensaje
    // Nota: Kafka envía objetos, a veces hay que parsear si viene como string
    const loan = typeof data === 'string' ? JSON.parse(data) : data;
    
    // Llamamos al servicio para actualizar el estado
    await this.projectorsService.markAsLoaned(loan.projectorId);
  }
}