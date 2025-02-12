import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './User';
import { ContentEntry } from './ContentEntry';
import type { User as UserType } from './User';
import type { ContentEntry as ContentEntryType } from './ContentEntry';

@Entity()
export class Comment {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => ContentEntry)
  contentEntry!: ContentEntryType;

  @ManyToOne(() => User)
  author!: UserType;

  @Property({ type: 'text' })
  content!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}