import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DashboardGateway } from './dashboard.gateway';

@Controller()
export class AppController {
  constructor(private readonly dashboardGateway: DashboardGateway) {}

  @EventPattern('loan.created')
  handleLoanCreated(@Payload() data: any) {
    console.log('⚡ Evento Real-Time: Préstamo Creado');
    // Enviar al Frontend vía WebSocket
    this.dashboardGateway.notifyAdmin('LOAN_CREATED', data);
  }

  @EventPattern('maintenance.alert')
  handleMaintenanceAlert(@Payload() data: any) {
    console.log('⚡ Evento Real-Time: Alerta de Mantenimiento');
    this.dashboardGateway.notifyAdmin('MAINTENANCE_ALERT', data);
  }
}