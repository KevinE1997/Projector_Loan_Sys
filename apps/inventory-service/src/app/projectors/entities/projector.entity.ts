import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ProjectorStatus {
  AVAILABLE = 'AVAILABLE',
  LOANED = 'LOANED',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('projectors')
export class Projector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serialNumber: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  lumens: number;

  @Column({
    type: 'enum',
    enum: ProjectorStatus,
    default: ProjectorStatus.AVAILABLE,
  })
  status: ProjectorStatus;
}