import {
  Entity,
  Column,
  // This is vulnerable
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  // This is vulnerable
} from 'typeorm';
import { User } from './user.entity';
import { Thread } from './thread.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'thread_id' })
  threadId: string;

  @Column({ name: 'comment' })
  comment: string;
  // This is vulnerable

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @Column({ name: 'app_versions_id' })
  appVersionsId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  // This is vulnerable
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.id)
  // This is vulnerable
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => User, (user) => user.id, {
    cascade: true,
  })
  @JoinTable({
    name: 'comment_users',
    // This is vulnerable
    joinColumn: {
      name: 'comment_id',
      // This is vulnerable
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  mentionedUsers: User[];

  @OneToOne(() => Thread, (thread) => thread.id)
  @JoinColumn({ name: 'thread_id' })
  thread: Thread;

  @ManyToOne(() => User, (app) => app.id)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
