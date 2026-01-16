import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum LoanStatus {
  ACTIVE = 'ACTIVE',       // Student has the projector
  RETURNED = 'RETURNED',   // Already returned it
  OVERDUE = 'OVERDUE',     // Overdue
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // User ID

  @Column()
  projectorId: string; // Projector ID

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date; // When it SHOULD be returned

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date; // When it was ACTUALLY returned

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.ACTIVE,
  })
  status: LoanStatus;

  @Column({ nullable: true })
  observations: string; // "Delivered without HDMI cable", etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
