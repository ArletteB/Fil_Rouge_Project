import { ResetPasswordTokenEntity } from '../../auth/reset-password/entities/reset-password-token.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { GroupeEntity } from '../../groupe/entities/groupe.entity';
import { PostEntity } from '../../post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  Like,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from '../../event/entities/event.entity';
import { LikeEntity } from '../../like/entities/like.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @Column({
    nullable: true,
  })
  imgProfile: string;

  @Column({
    nullable: true,
  })
  bio: string;

  @Column({
    nullable: true,
  })
  gender: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @ManyToMany(() => GroupeEntity, (groupe) => groupe.users)
  @JoinTable()
  groupes: GroupeEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => PostEntity, (comment) => comment.author)
  posts: PostEntity[];

  @OneToOne(() => ResetPasswordTokenEntity)
  @JoinColumn()
  resetPasswordToken: ResetPasswordTokenEntity;

  @OneToMany(() => EventEntity, (event) => event.CreatorEvent)
  events: EventEntity[];

  @ManyToMany(() => EventEntity, (event) => event.participants)
  @JoinTable()
  eventsParticipated: EventEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];
}
