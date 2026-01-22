import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity() // <--- ¡Vital! Esto marca la clase como una tabla de BD
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  loanId: string; // ID del préstamo

  @Column()
  userId: string; // Quién califica

  @Column('int')
  rating: number; // 1 a 5 estrellas

  @Column({ nullable: true }) // Puede ser nulo si el usuario no escribe nada
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}