import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectorDto {
  @ApiProperty({ example: 'proyector-001', description: 'Identificador único del proyector' })
  serialNumber: string;

  @ApiProperty({ example: 'Sony', description: 'Marca del proyector' })
  brand: string;

  // Optional: Default role is STUDENT, it's not mandatory to send it
  @ApiProperty({ example: 'Sony-001', description: 'Modelo del proyector' })
  model: string;

  @ApiProperty({ example: 3500, description: 'Brillo del proyector en lúmenes' })
  lumens: number;   

  @ApiProperty({ example: 'AVAILABLE', description: 'Estado del proyector' })
  status: string;

}