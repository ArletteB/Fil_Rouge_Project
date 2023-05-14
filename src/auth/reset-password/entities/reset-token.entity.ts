import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reset-password-token')
export class ResetPasswordTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @OneToOne(() => UserEntity, (user) => user.resetPassword)
  @JoinColumn()
  user: UserEntity;
}
