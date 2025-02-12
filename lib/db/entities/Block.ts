import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ContentEntry } from './ContentEntry';
import type { ContentEntry as ContentEntryType } from './ContentEntry';

@Entity()
export class Block {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => ContentEntry)
  contentEntry!: ContentEntryType;

  @Property()
  type!: 'text' | 'image' | 'video' | 'list' | 'reference' | 'link';

  @Property()
  position!: number;

  @Property({ type: 'jsonb' })
  data!: Record<string, any>;

  @Property({ nullable: true })
  url?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}