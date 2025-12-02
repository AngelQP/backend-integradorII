import { User } from "src/auth/entities/user.entity";
import { Book } from "src/book/entities";
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";




@Entity({ name: 'favorite' })
@Unique('UQ_favorito_usuario_libro', ['user', 'book'])
export class Favorite {


    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        eager: true, // opcional: trae el usuario asociado automáticamente
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Book, {
        onDelete: 'CASCADE',
        eager: true, // opcional: trae el libro asociado automáticamente
    })
    @JoinColumn({ name: 'book_id' })
    book: Book;

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