import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir conexión desde cualquier Frontend
  },
})
export class DashboardGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DashboardGateway');

  afterInit(server: Server) {
    this.logger.log('📡 WebSocket Gateway Inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // Método para enviar mensajes a todos los clientes conectados
  notifyAdmin(event: string, payload: any) {
    this.server.emit('admin-notification', {
      event,
      data: payload,
      timestamp: new Date(),
    });
  }
}