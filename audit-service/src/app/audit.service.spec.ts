import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLog } from './audit/schemas/audit-log.schema'; 

describe('AuditService', () => {
  let service: AuditService;

  // Mock del Modelo de Mongoose
  const mockAuditLogModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    constructor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
         
          provide: getModelToken(AuditLog.name), 
          useValue: mockAuditLogModel,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});