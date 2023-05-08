import { Timestamp } from 'src/Generic/timestamp.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reset-password')
export class ResetPasswordEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @OneToOne(() => UserEntity, (user) => user.resetPassword)
  user: UserEntity;
}
