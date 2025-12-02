import { BadRequestException, ForbiddenException, Injectable, 
         InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { BookCategory, BookImage } from './entities';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class BookService {

  constructor(
    
    // Inyeccion de repositorio de Book para el CRUD
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    // Inyeccion de repositorio de BookImage para el CRUD
     @InjectRepository(BookImage)
    private readonly imgRepository: Repository<BookImage>,

    // Inyeccion de repositorio de BookCategory para el CRUD
    @InjectRepository(BookCategory)
    private readonly bookCategoryRepo: Repository<BookCategory>,

    // Inyeccion de repositorio de Category para el CRUD
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

  ) {}

  // Creacion de libro
  async create(createBookDto: CreateBookDto, user: User, images: Express.Multer.File[]): Promise<Book> {

     if (images && images.length > 3) {
      throw new BadRequestException('Solo se permiten máximo 3 imágenes');
    }

    // Verificar categorías
    const categories = await this.categoryRepo.find({
      where: { id: In(createBookDto.categoryIds) }
    });

    if (categories.length !== createBookDto.categoryIds.length) {
      throw new BadRequestException('Alguna categoría enviada no existe');
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      seller: user,
      isActive: true,
    });

    // Procesar imágenes
    if (images) {
      const bookImages = images.map((file, index) => {
        const newImage = new BookImage();
        newImage.url = `/uploads/books/${file.filename}`;
        newImage.isMain = index === 0;
        return newImage;
      });
      book.images = bookImages;
    }

    const savedBook = await this.bookRepository.save(book);

    // Relación categorías
    const bookCategories = createBookDto.categoryIds.map(id => {
      const bc = new BookCategory();
      bc.categoryId = id;
      bc.libroId = savedBook.id;
      return bc;
    });

    await this.bookCategoryRepo.save(bookCategories);

    return savedBook;
  }

  // -------------------------
  // FIND ALL
  // -------------------------
  async findAll() {
    return this.bookRepository.find({
      where: { isActive: true },
    });
  }

  // -------------------------
  // FIND ONE
  // -------------------------
  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id, isActive: true }
    });

    if (!book) throw new NotFoundException('Libro no encontrado');

    return book;
  }

  // -------------------------
  // UPDATE
  // -------------------------
  async update(id: string, updateBookDto: UpdateBookDto, user: User) {

    const book = await this.bookRepository.findOne({
      where: { id }
    });

    if (!book) throw new NotFoundException('Libro no encontrado');
    if (book.seller.id !== user.id) throw new ForbiddenException('No eres el dueño del libro');

    await this.bookRepository.update(id, updateBookDto);

    // Si viene nueva lista de categorías
    if (updateBookDto.categoryIds) {
      await this.bookCategoryRepo.delete({ libroId: id });

      const newCategories = updateBookDto.categoryIds.map(cid => {
        const bc = new BookCategory();
        bc.categoryId = cid;
        bc.libroId = id;
        return bc;
      });

      await this.bookCategoryRepo.save(newCategories);
    }

    return this.findOne(id);
  }


   // -------------------------
  // DELETE (BORRADO LÓGICO)
  // -------------------------
  async remove(id: string, user: User) {
    const book = await this.bookRepository.findOne({
      where: { id }
    });

    if (!book) throw new NotFoundException('Libro no encontrado');
    if (book.seller.id !== user.id) throw new ForbiddenException('No eres el dueño del libro');

    book.isActive = false;
    await this.bookRepository.save(book);

    await this.bookRepository.softDelete(id);

    return { message: 'Libro eliminado lógicamente' };
  }


  /* Metodo agregado para validacion de error de duplicado */

  private handleDBErrors( error: any ): never {
  
      if( error.code === '23505' ) 
        throw new BadRequestException(error.detail);
  
      console.log(error);
  
      throw new InternalServerErrorException('Checa los server logs. Gil !!')
    }

  
}
