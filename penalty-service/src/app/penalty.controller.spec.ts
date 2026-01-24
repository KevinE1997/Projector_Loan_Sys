import { Test, TestingModule } from '@nestjs/testing';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';

describe('PenaltyController', () => {
  let controller: PenaltyController;

  const mockPenaltyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenaltyController],
      providers: [
        {
          provide: PenaltyService,
          useValue: mockPenaltyService,
        },
      ],
    }).compile();

    controller = module.get<PenaltyController>(PenaltyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
