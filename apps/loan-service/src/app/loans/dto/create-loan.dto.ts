import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ example: 'UUID-DEL-USUARIO', description: 'ID del usuario que solicita' })
  userId: string;

  @ApiProperty({ example: 'UUID-DEL-PROYECTOR', description: 'ID del proyector a prestar' })
  projectorId: string;

  @ApiProperty({ example: '2026-01-20T10:00:00Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-01-20T12:00:00Z' })
  endDate: Date;

  @ApiProperty({ required: false, example: 'Clase de Programación' })
  observations?: string;
}