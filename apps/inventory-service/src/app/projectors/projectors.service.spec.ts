import { Test, TestingModule } from '@nestjs/testing';
import { ProjectorsService } from './projectors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Projector } from './entities/projector.entity';

describe('ProjectorsService', () => {
  let service: ProjectorsService;

  // Mock del Repositorio
  const mockProjectorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectorsService,
        {
          provide: getRepositoryToken(Projector),
          useValue: mockProjectorRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectorsService>(ProjectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
