import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity({ name: 'book_categorys' })
export class BookCategory {
  @PrimaryColumn({ name: 'book_id', type: 'uuid'})
  libroId: string;

  @PrimaryColumn({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  /* Relacion entre libro y categoria */
  @ManyToOne(() => Book, (book) => book.BookCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Category, (category) => category.bookCategorys, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;
}
