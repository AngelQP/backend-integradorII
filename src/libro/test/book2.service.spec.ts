import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookService } from '../book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book } from '../entities';


describe('BookService - CP03 Registro de libro válido', () => {
  let bookService: BookService;

  const mockBookRepository = {
    findOne: jest.fn(), 
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);

    jest.clearAllMocks();
  });

  // -------------------------
  // CP03 - Valor de prueba 1
  // -------------------------
  it('CP03-1 - Registrar libro "Clean Code" con datos válidos', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      price: 120.5,
      stock: 10,
      // idVendedor: 5,
      // idCategoria: 2,
    } as any; // quita el "as any" si tu DTO coincide exactamente

    const libroCreado: Partial<Book> = {
      id: 'uuid-libro-1',
      ...createBookDto,
      isActive: true,
    };

    mockBookRepository.create.mockReturnValue(libroCreado);
    mockBookRepository.save.mockResolvedValue(libroCreado);

    const result = await bookService.create(createBookDto);

    expect(mockBookRepository.create).toHaveBeenCalledWith({
      ...createBookDto
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });

  // -------------------------
  // CP03 - Valor de prueba 2
  // -------------------------
  it('CP03-2 - Registrar libro "Patrones de Diseño" con datos válidos', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Patrones de Diseño',
      author: 'GOF',
      price: 90.0,
      stock: 5,
      // idVendedor: 6,
      // idCategoria: 3,
    } as any;

    const libroCreado: Partial<Book> = {
      id: 'uuid-libro-2',
      ...createBookDto,
      isActive: true,
    };

    mockBookRepository.create.mockReturnValue(libroCreado);
    mockBookRepository.save.mockResolvedValue(libroCreado);

    const result = await bookService.create(createBookDto);

    expect(mockBookRepository.create).toHaveBeenCalledWith({
      ...createBookDto
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });

  // -------------------------
  // CP03 - Valor de prueba 3
  // -------------------------
  it('CP03-3 - Registrar libro "Introducción a Java" con datos válidos', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Introducción a Java',
      author: 'Deitel',
      price: 150.0,
      stock: 20,
      // idVendedor: 7,
      // idCategoria: 4,
    } as any;

    const libroCreado: Partial<Book> = {
      id: 'uuid-libro-3',
      ...createBookDto,
      isActive: true,
    };

    mockBookRepository.create.mockReturnValue(libroCreado);
    mockBookRepository.save.mockResolvedValue(libroCreado);

    const result = await bookService.create(createBookDto);

    expect(mockBookRepository.create).toHaveBeenCalledWith({
      ...createBookDto,
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });

  // -------------------------
  // CP03 - Valor de prueba 4
  // -------------------------
  it('CP03-4 - Registrar libro "Matemáticas Básicas" con stock 0', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Matemáticas Básicas',
      author: 'Varios',
      price: 50.0,
      stock: 0, // stock cero permitido
      // idVendedor: 5,
      // idCategoria: 1,
    } as any;

    const libroCreado: Partial<Book> = {
      id: 'uuid-libro-4',
      ...createBookDto,
      isActive: true,
    };

    mockBookRepository.create.mockReturnValue(libroCreado);
    mockBookRepository.save.mockResolvedValue(libroCreado);

    const result = await bookService.create(createBookDto);

    expect(mockBookRepository.create).toHaveBeenCalledWith({
      ...createBookDto,
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });


  // =========================================================
  // CP05 - Búsqueda de libro por título existente
  // =========================================================
  describe('CP05 - Búsqueda de libro por título', () => {

    // Valor de prueba 1: título exacto "Clean Code"
    it('CP05-1 - Buscar por título exacto "Clean Code"', async () => {
      const term = 'Clean Code';

      const booksFromDb: Partial<Book>[] = [
        {
          id: 'uuid-book-1',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          price: 120.5,
          // stock: 10,
        },
      ];

      mockBookRepository.find.mockResolvedValue(booksFromDb);

      const result = await bookService.findByTitle(term);

      // Se llama al repositorio con el título normalizado (sin espacios extras)
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        where: { title: 'Clean Code' },
      });

      // Devuelve los mismos libros que el repositorio
      expect(result).toEqual(booksFromDb);
    });

    // Valor de prueba 2: mismo título, pero con espacios extra
    it('CP05-2 - Buscar por título con espacios extra "  Clean Code  "', async () => {
      const term = '  Clean Code  ';

      const booksFromDb: Partial<Book>[] = [
        {
          id: 'uuid-book-2',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          price: 120.5,
          // stock: 10,
        },
      ];

      mockBookRepository.find.mockResolvedValue(booksFromDb);

      const result = await bookService.findByTitle(term);

      // El servicio debe trim() el término antes de buscar
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        where: { title: 'Clean Code' },
      });

      expect(result).toEqual(booksFromDb);
    });

    // Valor de prueba 3: otro título existente "Patrones de Diseño"
    it('CP05-3 - Buscar por título existente "Patrones de Diseño"', async () => {
      const term = 'Patrones de Diseño';

      const booksFromDb: Partial<Book>[] = [
        {
          id: 'uuid-book-3',
          title: 'Patrones de Diseño',
          author: 'GOF',
          price: 90.0,
          // stock: 5,
        },
      ];

      mockBookRepository.find.mockResolvedValue(booksFromDb);

      const result = await bookService.findByTitle(term);

      expect(mockBookRepository.find).toHaveBeenCalledWith({
        where: { title: 'Patrones de Diseño' },
      });

      expect(result).toEqual(booksFromDb);
    });

    // Valor de prueba 4: título que no existe -> lista vacía
    it('CP05-4 - Buscar por un título que no existe devuelve lista vacía', async () => {
      const term = 'TituloQueNoExiste';

      mockBookRepository.find.mockResolvedValue([]);

      const result = await bookService.findByTitle(term);

      expect(mockBookRepository.find).toHaveBeenCalledWith({
        where: { title: 'TituloQueNoExiste' },
      });

      expect(result).toEqual([]);
    });
  });


   // =========================================================
  // CP06 - Eliminación lógica de libro (baja del catálogo)
  // =========================================================
  describe('CP06 - Eliminación lógica de libro (baja del catálogo)', () => {

    // Valor de prueba 1: libro existente ACTIVO
    it('CP06-1 - Debe marcar como inactivo un libro ACTIVO existente', async () => {
      const id = 'uuid-book-10';

      const bookInDb: Partial<Book> = {
        id,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 120.5,
        stock: 10,
        isActive: true,                 // si tu entidad usa "estado", cámbialo
      } as any;

      const bookUpdated: Partial<Book> = {
        ...bookInDb,
        isActive: false,
      };

      mockBookRepository.findOne.mockResolvedValue(bookInDb);
      mockBookRepository.save.mockResolvedValue(bookUpdated);

      const result = await bookService.remove(id);

      // Se busca el libro por id
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      // Se guarda con isActive = false
      expect(mockBookRepository.save).toHaveBeenCalledWith({
        ...bookInDb,
        isActive: false,
      });

      expect(result).toEqual(bookUpdated);
    });

    // Valor de prueba 2: libro ya INACTIVO
    it('CP06-2 - Si el libro ya está inactivo, no debe volver a guardarlo', async () => {
      const id = 'uuid-book-11';

      const bookInDb: Partial<Book> = {
        id,
        title: 'Patrones de Diseño',
        author: 'GOF',
        price: 90.0,
        stock: 5,
        isActive: false,
      } as any;

      mockBookRepository.findOne.mockResolvedValue(bookInDb);

      const result = await bookService.remove(id);

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      // No debería llamar save si ya está inactivo
      expect(mockBookRepository.save).not.toHaveBeenCalled();

      // Devuelve el libro tal como está en BD
      expect(result).toEqual(bookInDb);
    });

    // Valor de prueba 3: libro que no existe
    it('CP06-3 - Si el libro no existe, debe lanzar NotFoundException', async () => {
      const id = 'uuid-book-999';

      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(bookService.remove(id)).rejects.toThrow('Book not found');

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      expect(mockBookRepository.save).not.toHaveBeenCalled();
    });

    // Valor de prueba 4: libro ACTIVO con relaciones (ventas, etc.) pero se hace baja lógica
    it('CP06-4 - Debe permitir baja lógica aunque tenga relaciones (simuladas)', async () => {
      const id = 'uuid-book-12';

      const bookInDb: Partial<Book> = {
        id,
        title: 'Introducción a Java',
        author: 'Deitel',
        price: 150.0,
        stock: 20,
        isActive: true,
        // ventas: [...]  // si tu entidad tiene relaciones, se pueden simular como propiedades extra
      } as any;

      const bookUpdated: Partial<Book> = {
        ...bookInDb,
        isActive: false,
      };

      mockBookRepository.findOne.mockResolvedValue(bookInDb);
      mockBookRepository.save.mockResolvedValue(bookUpdated);

      const result = await bookService.remove(id);

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      expect(mockBookRepository.save).toHaveBeenCalledWith({
        ...bookInDb,
        isActive: false,
      });

      expect(result).toEqual(bookUpdated);
    });
  });


});
