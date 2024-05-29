import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Entity('secret')
export class Secret {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  old_password: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ default: null, nullable: true })
  code: number;

  @OneToOne(() => User, (user) => user.secret)
  user: User;
}
