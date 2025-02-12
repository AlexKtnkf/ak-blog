import { Entity, PrimaryKey, Property, Collection, ManyToMany } from '@mikro-orm/core';
import { ContentEntry } from './ContentEntry';
import type { ContentEntry as ContentEntryType } from './ContentEntry';

@Entity()
export class Tag {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property()
  type!: 'tag' | 'category';

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  parentId?: number;

  @ManyToMany(() => ContentEntry, entry => entry.tags)
  entries = new Collection<ContentEntryType>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.entries = new Collection<ContentEntryType>(this);
  }
}
