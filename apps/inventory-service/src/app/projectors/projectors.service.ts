import { Injectable } from '@nestjs/common';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';
import { Projector, ProjectorStatus } from './entities/projector.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class ProjectorsService {
  constructor(
    @InjectRepository(Projector)
    private readonly projectorRepository: Repository<Projector>,)
    {}

  async create(createProjectorDto: CreateProjectorDto) {
    return this.projectorRepository.save(createProjectorDto);
  }

  async findAll() {
    return this.projectorRepository.find();
  }

  findOne(id: string) {
    return this.projectorRepository.findOneBy({ id });
  }

  update(id: number, updateProjectorDto: UpdateProjectorDto) {
    return `This action updates a #${id} projector`;
  }

  remove(id: number) {
    return `This action removes a #${id} projector`;
  }

  async markAsLoaned(projectorId: string) {
    // Find the projector
    const projector = await this.projectorRepository.findOneBy({ id: projectorId });
    
    if (!projector) {
      console.log(`Error: Projector ${projectorId} not found for loan.`);
      return;
    }

    // Change status
    projector.status = ProjectorStatus.LOANED;
    
    // Save
    await this.projectorRepository.save(projector);
    console.log(`Projector ${projector.id} marked as LOANED.`);
  }

  async markAsAvailable(projectorId: string) {
    const projector = await this.projectorRepository.findOneBy({ id: projectorId });

    if (!projector) {
      console.log(`Error: Proyector ${projectorId} no encontrado para devolución.`);
      return;
    }

    projector.status = ProjectorStatus.AVAILABLE;
    await this.projectorRepository.save(projector);
    console.log(`Proyector ${projector.id} marcado como DISPONIBLE.`);
  }
}
