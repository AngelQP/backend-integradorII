import { Column, CreateDateColumn, DeleteDateColumn, 
         Entity, JoinColumn, ManyToOne, 
         OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookImage } from "./bookImage.entity";
import { BookCategory } from './bookCategory.entity';
import { User } from '../../auth/entities/user.entity';


export enum BookCondition {
    NUEVO = 'NUEVO',
    USADO = 'USADO'
};

@Entity({ name: 'books' })
export class Book {

    @PrimaryGeneratedColumn('uuid')
    id: string;

     // Vendedor que publica el libro
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'seller_id' })
    seller: User;

    @Column('text')
    title: string;

    @Column('text',{
        nullable: true
    })
    author?: string;

    @Column('text', {
        nullable: true
    })
    description?: string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column('smallint',{
        default: 1
    })
    stock: number;

    @Column('smallint',{
        nullable: true
    })
    discount?: number;

    @Column('smallint',{
        nullable: true
    })
    yearPublication?: number;

    @Column('int', {
        nullable: true
    })
    numberPages?: number;

    @Column('text',{
        nullable: true
    })
    lenguage?: string;

    @Column({
        type: 'enum',
        enum: BookCondition
    })
    state: BookCondition;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    // images
    @OneToMany(
        () => BookImage,
        ( bookImage ) => bookImage.book,
        { cascade: true, eager: true}
    )
    images?: BookImage[];

    @OneToMany(() => BookCategory, (bc) => bc.book, {
    cascade: true,
    })
    BookCategory: BookCategory[];

    /* Dates CRUD */

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
