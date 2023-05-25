import { ResetPasswordTokenEntity } from 'src/auth/reset-password/entities/reset-password-token.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { GroupeEntity } from '../../groupe/entities/groupe.entity';
import { PostEntity } from '../../post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
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

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  postalCode: string;

  @ManyToMany(() => GroupeEntity, (groupe) => groupe.users)
  @JoinTable()
  groupes: GroupeEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.auhtor)
  comments: CommentEntity[];

  @OneToMany(() => PostEntity, (comment) => comment.author)
  posts: PostEntity[];

  @OneToOne(() => ResetPasswordTokenEntity)
  @JoinColumn()
  resetPasswordToken: ResetPasswordTokenEntity;
}
