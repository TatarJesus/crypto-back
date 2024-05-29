import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Secret } from '@/modules/secret/entities/secret.entity';
import { UserNotification } from '@/modules/user_notifications/entities/user_notification.entity';
import { UserDeposits3Commas } from '@/modules/user_deposits_3commas/entities/user_deposits_3commas.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ default: false, nullable: false })
  verified: boolean;

  @OneToOne(() => Secret, (secret) => secret.user, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'secret_id' })
  secret: Secret;

  @OneToMany(() => UserDeposits3Commas, (UserDeposits3Commas) => UserDeposits3Commas.user, {
    onDelete: 'CASCADE',
  })
  deposits_3commas: UserDeposits3Commas[];

  @OneToMany(() => UserNotification, (UserNotification) => UserNotification.user, {
    onDelete: 'CASCADE',
  })
  notifications: UserNotification[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;
}
