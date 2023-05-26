import { Timestamp } from '../../Generic/timestamp.entity';
import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comment')
export class CommentEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;
}
