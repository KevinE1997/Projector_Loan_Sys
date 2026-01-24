import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from './maintenance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaintenanceTicket } from './entities/maintenance.entity'; 

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  // Mock del Repositorio
  const mockMaintenanceRepository = {
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
        MaintenanceService,
        {
          
          provide: getRepositoryToken(MaintenanceTicket),
          useValue: mockMaintenanceRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});