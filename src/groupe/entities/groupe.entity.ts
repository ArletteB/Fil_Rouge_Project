import { Timestamp } from 'src/Generic/timestamp.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('groupe')
export class GroupeEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  cover: string;

  @OneToMany(() => PostEntity, (post) => post.groupe)
  posts: PostEntity[];

  @ManyToMany(() => UserEntity, (user) => user.groupes)
  users: UserEntity[];
}
