import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BookCategory } from './bookCategory.entity';

@Entity({ name: 'categorys' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text', {
    unique: true
  })
  name: string;

  @Column('text', {
    nullable: true
  })
  description?: string;

  @Column({ type: 'boolean', default: true })
  state: boolean;

  @OneToMany(() => BookCategory, (bc) => bc.category)
  bookCategorys: BookCategory[];

  /* Dates CRUD */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date | null;
}
