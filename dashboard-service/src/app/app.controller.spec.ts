import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DashboardGateway } from './dashboard.gateway'; 

describe('AppController', () => {
  let appController: AppController;

  // Mock del Gateway de WebSockets
  const mockDashboardGateway = {
    server: { emit: jest.fn() }, // Simula la emisión de eventos
    handleConnection: jest.fn(),
    handleDisconnect: jest.fn(),
     handleLoanCreated: jest.fn(),
     handleMaintenanceAlert: jest.fn(),
   
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          // 👇 Aquí solucionamos el error: Proveemos el Gateway falso
          provide: DashboardGateway,
          useValue: mockDashboardGateway,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});