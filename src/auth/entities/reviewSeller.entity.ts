import { Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";




@Entity({ name: 'review_seller' })
@Unique('UQ_review_seller_client', ['seller', 'client'])
@Check('"calification" >= 1 AND "calification" <= 5')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  // Vendedor que recibe la reseña
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  // Cliente que deja la reseña
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: User;

  // Calificación entre 1 y 5
  @Column({ type: 'smallint' })
  calification: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

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