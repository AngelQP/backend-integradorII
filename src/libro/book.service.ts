import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  
  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Aquí podrías validar vendedor/categoría, etc. De momento es básico.
     const { title, author } = createBookDto; // ajusta si tus campos se llaman distinto

    // Normalización básica
    const normalizedTitle = title.trim();
    const normalizedAuthor = author.trim();

    // 1. Verificar duplicado título + autor
    const existing = await this.bookRepository.findOne({
      where: {
        title: normalizedTitle,
        author: normalizedAuthor,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Book with same title and author already exists',
      );
    }

    // 2. Crear registro
    const book = this.bookRepository.create({
      ...createBookDto,
      title: normalizedTitle,
      author: normalizedAuthor,
      // isActive: true, // solo si tu entidad tiene este campo
    });

    const saved = await this.bookRepository.save(book);
    return saved;
  }

  findAll() {
    return `This action returns all libro`;
  }

  findOne(id: number) {
    return `This action returns a #${id} libro`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} libro`;
  }

  async remove(id: string): Promise<Book> {             // si tu id es number, cambia a number
    const book = await this.bookRepository.findOne({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Si ya está inactivo, simplemente lo devolvemos
    if ((book as any).isActive === false) {
      return book;
    }

    // Baja lógica
    (book as any).isActive = false;                    // cambia a book.estado = 'INACTIVO' si usas ese campo

    const updated = await this.bookRepository.save(book);
    return updated;
  }

  /* Metodo agregado */

  async findByTitle(term: string): Promise<Book[]> {
    const normalized = term.trim();

    // Si el término está vacío, devolvemos lista vacía
    if (!normalized) {
      return [];
    }

    const books = await this.bookRepository.find({
      where: { title: normalized },
    });

    return books;
  }
}
