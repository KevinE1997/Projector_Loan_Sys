import { Test, TestingModule } from '@nestjs/testing';
import { PenaltyService } from './penalty.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Penalty } from './entities/penalty.entity';

describe('PenaltyService', () => {
  let service: PenaltyService;

  const mockPenaltyRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PenaltyService,
        {
          provide: getRepositoryToken(Penalty),
          useValue: mockPenaltyRepository,
        },
      ],
    }).compile();

    service = module.get<PenaltyService>(PenaltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
