import { Entity, PrimaryKey, Property, Collection, OneToMany } from '@mikro-orm/core';
import { ContentEntry } from './ContentEntry';
import { Comment } from './Comment';
import type { ContentEntry as ContentEntryType } from './ContentEntry';
import type { Comment as CommentType } from './Comment';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  passwordHash?: string;

  @Property()
  name!: string;

  @Property()
  role: 'user' | 'admin' = 'user';

  @Property({ nullable: true })
  authProvider?: string;

  @OneToMany(() => ContentEntry, entry => entry.author)
  entries = new Collection<ContentEntryType>(this);

  @OneToMany(() => Comment, comment => comment.author)
  comments = new Collection<CommentType>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor() {
    this.entries = new Collection<ContentEntryType>(this);
    this.comments = new Collection<CommentType>(this);
  }
}