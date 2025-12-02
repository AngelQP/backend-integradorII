import { BookCategory } from 'src/book/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'categorys' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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


  @BeforeInsert()
    checkSlugInsert(){
        this.name = this.name
            .trim()
            .toLocaleUpperCase()
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.name = this.name
            .trim()
            .toLocaleUpperCase()
    }
}
