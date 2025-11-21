import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookService } from '../book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book } from '../entities';


describe('BookService - CP03 Registro de libro válido', () => {
  let bookService: BookService;

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      precio: 120.5,
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
      ...createBookDto,
      isActive: true,
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });

  // -------------------------
  // CP03 - Valor de prueba 2
  // -------------------------
  it('CP03-2 - Registrar libro "Patrones de Diseño" con datos válidos', async () => {
    const createBookDto: CreateBookDto = {
      titulo: 'Patrones de Diseño',
      autor: 'GOF',
      precio: 90.0,
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
      ...createBookDto,
      isActive: true,
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });

  // -------------------------
  // CP03 - Valor de prueba 3
  // -------------------------
  it('CP03-3 - Registrar libro "Introducción a Java" con datos válidos', async () => {
    const createBookDto: CreateBookDto = {
      titulo: 'Introducción a Java',
      autor: 'Deitel',
      precio: 150.0,
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
      isActive: true,
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });

  // -------------------------
  // CP03 - Valor de prueba 4
  // -------------------------
  it('CP03-4 - Registrar libro "Matemáticas Básicas" con stock 0', async () => {
    const createBookDto: CreateBookDto = {
      titulo: 'Matemáticas Básicas',
      autor: 'Varios',
      precio: 50.0,
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
      isActive: true,
    });

    expect(mockBookRepository.save).toHaveBeenCalledWith(libroCreado);

    expect(result).toEqual(libroCreado);
  });
});
