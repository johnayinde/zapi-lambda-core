import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Profile extends SharedEntity {
  @Column()
  email: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  picture: string;

  @Column('text', { array: true, nullable: true, default: [] })
  subscriptions: string[];
}
