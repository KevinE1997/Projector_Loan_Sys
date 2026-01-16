import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'juan@uni.edu', description: 'Correo institucional' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña segura' })
  password: string;

  // Optional: Default role is STUDENT, it's not mandatory to send it
  @ApiProperty({ example: 'STUDENT', required: false })
  role?: string;
}