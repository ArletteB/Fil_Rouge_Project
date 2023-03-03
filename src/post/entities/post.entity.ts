import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Timestamp } from 'src/Generic/timestamp.entity';
import { GroupeEntity } from 'src/groupe/entities/groupe.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post')
export class PostEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  legend: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => GroupeEntity, (groupe) => groupe.posts)
  groupe: GroupeEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.posts)
  author: UserEntity;
}
