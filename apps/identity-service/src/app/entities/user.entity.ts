import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Table name in Postgres
export class User {
  @PrimaryGeneratedColumn('uuid') // Unique ID type UUID (e.g: a0eebc99-9c0b...)
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Here we will store the hash, not plain text

  @Column({ default: 'STUDENT' }) // Roles: STUDENT, PROFESSOR, ADMIN
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
