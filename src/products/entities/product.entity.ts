import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Fabrication {
  NATIONAL = 'National',
  IMPORTED = 'Imported',
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Fabrication })
  fabrication: 'National' | 'Imported';

  @Column({ type: 'float' })
  size: number;

  @Column({ type: 'float', default: 0.0 })
  value: number;
}
