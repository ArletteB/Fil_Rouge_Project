import { Timestamp } from 'src/Generic/timestamp.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reset-password-token')
export class ResetPasswordTokenEntity extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @OneToOne(() => UserEntity, (user) => user.resetPasswordToken)
  user: UserEntity;
}
