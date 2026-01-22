import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class MaintenanceTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  loanId: string; // Qué préstamo causó el daño

  @Column()
  description: string; // "El proyector echa humo..."

  @Column({ default: 'PENDING' })
  status: string; // PENDING, IN_PROGRESS, FIXED

  @Column({ default: 'HIGH' })
  severity: string;

  @CreateDateColumn()
  createdAt: Date;
}