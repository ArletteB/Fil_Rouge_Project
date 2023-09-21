import { UserEntity } from '../../user/entities/user.entity';
import { Timestamp } from '../../Generic/timestamp.entity';

import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('event')
export class EventEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  dateEvent: Date;

  @Column()
  adress: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  CreatorEvent: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.id)
  @JoinTable()
  participants: UserEntity[];
}
