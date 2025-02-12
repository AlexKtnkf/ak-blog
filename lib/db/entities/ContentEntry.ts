import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, ManyToMany } from '@mikro-orm/core';
import { User } from './User';
import { Block } from './Block';
import { Tag } from './Tag';
import { Comment } from './Comment';
import type { User as UserType } from './User';
import type { Block as BlockType } from './Block';
import type { Tag as TagType } from './Tag';
import type { Comment as CommentType } from './Comment';

@Entity()
export class ContentEntry {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  slug!: string;

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  summary?: string;

  @Property()
  status: 'draft' | 'published' | 'archived' = 'draft';

  @Property()
  type: 'article' | 'news_flash' | 'static_page' = 'article';

  @ManyToOne(() => User)
  author!: UserType;

  @OneToMany(() => Block, block => block.contentEntry)
  blocks = new Collection<BlockType>(this);

  @OneToMany(() => Comment, comment => comment.contentEntry)
  comments = new Collection<CommentType>(this);

  @ManyToMany(() => Tag)
  tags = new Collection<TagType>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  publishedAt?: Date

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.tags = new Collection<TagType>(this);
  }
}