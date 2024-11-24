import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Journey extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-json')
  coordinates: { lat: number; lng: number };

  @Column('simple-array')
  images: string[];

  @Column()
  content: string;

  @Column('simple-json')
  places: {
    id: string;
    placeName: string;
    addressName: string;
  }[];

  @Column('simple-array', { default: [] })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC',
  })
  status: 'PUBLIC' | 'PRIVATE';

  @ManyToOne(() => User, (user) => user.journeys, { eager: false })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
