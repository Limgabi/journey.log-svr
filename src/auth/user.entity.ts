import { Journey } from 'src/journeys/journey.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  password: string;

  @OneToMany(() => Journey, (journey) => journey.author, { eager: true }) // eager: true => user 정보 가져올 때 board 정보도 가져옴
  journeys: Journey[];

  @CreateDateColumn()
  createAt: Date;
}
