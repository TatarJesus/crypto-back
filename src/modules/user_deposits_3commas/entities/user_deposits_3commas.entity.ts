import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PLATFORMS_TYPE, Status } from '@/types/deposits';
import { User } from '@/modules/user/entities/user.entity';

@Entity('user_deposit_3commas')
export class UserDeposits3Commas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  platform: PLATFORMS_TYPE;

  @Column({ nullable: false })
  status: Status;

  @Column({ type: 'float', nullable: false, default: 1 })
  amount_start: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.deposits_3commas)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
