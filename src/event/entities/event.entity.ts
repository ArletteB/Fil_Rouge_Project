import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  dateEvent: Date;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  CreatorEvent: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.id)
  participants: UserEntity[];
}
