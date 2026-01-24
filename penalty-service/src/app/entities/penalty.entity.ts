import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Penalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // The penalized student

  @Column()
  loanId: string; // The related loan

  @Column()
  reason: string; // "Delay" or "Damage"

  @Column('decimal')
  amount: number; // Amount in Dollars ($)

  @Column({ default: 'PENDING' })
  status: string; // PENDING, PAID

  @CreateDateColumn()
  createdAt: Date;
}