import { Test, TestingModule } from '@nestjs/testing';
import { ProjectorsController } from './projectors.controller';
import { ProjectorsService } from './projectors.service';

describe('ProjectorsController', () => {
  let controller: ProjectorsController;

  // Mock del Servicio
  const mockProjectorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectorsController],
      providers: [
        {
          provide: ProjectorsService,
          useValue: mockProjectorsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectorsController>(ProjectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
