import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices'; // <--- Importar
import { ProjectorsService } from './projectors.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';



@Controller('projectors')
export class ProjectorsController {
  constructor(private readonly projectorsService: ProjectorsService) {}

  @Post()
  create(@Body() createProjectorDto: CreateProjectorDto) {
    return this.projectorsService.create(createProjectorDto);
  }

  @Get()
  @CacheKey('all_projectors') // Cache key name in Redis
  @CacheTTL(60 * 1000) // This endpoint will live 60 seconds in memory
  findAll() {
    console.log('Querying the Real Database...'); // Log for testing
    return this.projectorsService.findAll();
  }

 
  @EventPattern('loan.created')
  async handleLoanCreated(@Payload() data: any) {
    console.log('Evento recibido en Inventory: loan.created', data);
    
    // Extract the projector ID from the message
    const loan = typeof data === 'string' ? JSON.parse(data) : data;
    
    // Call the service to update the status
    await this.projectorsService.markAsLoaned(loan.projectorId);
  }
  
  @EventPattern('loan.returned')
  async handleLoanReturned(@Payload() data: any) {
    console.log('Evento recibido en Inventory: loan.returned', data);
    
    const payload = typeof data === 'string' ? JSON.parse(data) : data;
    
    await this.projectorsService.markAsAvailable(payload.projectorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectorsService.findOne(id);
  }


}