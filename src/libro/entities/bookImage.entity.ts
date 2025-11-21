import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Book } from "./book.entity";


@Entity({ name:'book_images'  })
export class BookImage {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('text')
    url: string;

    @Column('boolean',{
         name: 'is_main', 
         default: false 
        })
    isMain: boolean;

    @ManyToOne(
        () => Book,
        ( book ) => book.images,
        {onDelete: 'CASCADE'}        
    )
    book: Book


    @CreateDateColumn({
        select: false
    })
    createdAt: Date;

    @UpdateDateColumn({
        select: false
    })
    updatedAt: Date;

    @DeleteDateColumn({
        select: false
    })
    deletedAt: Date;

}