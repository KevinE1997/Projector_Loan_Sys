import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config/dist/config.service';

describe('LoansService', () => {
  let service: LoansService;

  const mockLoanRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockKafkaClient = {
    emit: jest.fn(),
    send: jest.fn(),
    connect: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    axiosRef: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        // Proveedor 1: Repositorio
        {
          provide: getRepositoryToken(Loan),
          useValue: mockLoanRepository,
        },
        // Proveedor 2: Kafka Client
        {
          provide: 'KAFKA_CLIENT', // 👈 Debe coincidir con tu @Inject('KAFKA_CLIENT')
          useValue: mockKafkaClient,
        },
        // Proveedor 3: HttpService
        {
          provide: HttpService,
          useValue: mockHttpService,
        },

        // Proveedor 4: ConfigService
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'INVENTORY_SERVICE_URL') return 'http://localhost:3002/api';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
