import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Gender {
  MASCULINE = 'Masculine',
  FEMININE = 'Feminine',
}

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ unique: true, width: 25 })
  document: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: 'Masculine' | 'Feminine';

  @Column({ unique: true })
  email: string;
}
