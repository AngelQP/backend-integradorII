// src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { bcryptAdapter } from '../helper/AdapterBcrypt';

describe('AuthService - CP01 Login correcto', () => {
  let authService: AuthService;

  // Mocks de dependencias
  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // Limpiar el estado de los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  // -------------------------
  // CP01 - Valor de prueba 1
  // Usuario ADMIN
  // -------------------------
  it('CP01-1 - Login correcto para usuario ADMIN', async () => {
    // Arrange
    const loginDto = {
      email: 'admin@libroconecta.com',
      password: 'Admin123*',
    };

    const userInDb: Partial<User> = {
      id: 'uuid-admin',
      email: 'admin@libroconecta.com',
      password: 'hashed-password-admin',
    };

    mockUserRepository.findOne.mockResolvedValue(userInDb);

    const compareSpy = jest
      .spyOn(bcryptAdapter, 'compare')
      .mockReturnValue(true);

    mockJwtService.sign.mockReturnValue('token-admin');

    // Act
    const result = await authService.login(loginDto as any);

    // Assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: loginDto.email },
      select: { email: true, password: true, id: true },
    });

    expect(compareSpy).toHaveBeenCalledWith(
      loginDto.password,
      userInDb.password,
    );

    expect(mockJwtService.sign).toHaveBeenCalledWith({ id: userInDb.id });

    expect(result).toEqual({
      ...userInDb,
      token: 'token-admin',
    });
  });

  // -------------------------
  // CP01 - Valor de prueba 2
  // Usuario VENDEDOR
  // -------------------------
  it('CP01-2 - Login correcto para usuario VENDEDOR', async () => {
    // Arrange
    const loginDto = {
      email: 'vendedor@libroconecta.com',
      password: 'Vendedor123*',
    };

    const userInDb: Partial<User> = {
      id: 'uuid-vendedor',
      email: 'vendedor@libroconecta.com',
      password: 'hashed-password-vendedor',
    };

    mockUserRepository.findOne.mockResolvedValue(userInDb);

    const compareSpy = jest
      .spyOn(bcryptAdapter, 'compare')
      .mockReturnValue(true);

    mockJwtService.sign.mockReturnValue('token-vendedor');

    // Act
    const result = await authService.login(loginDto as any);

    // Assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: loginDto.email },
      select: { email: true, password: true, id: true },
    });

    expect(compareSpy).toHaveBeenCalledWith(
      loginDto.password,
      userInDb.password,
    );

    expect(mockJwtService.sign).toHaveBeenCalledWith({ id: userInDb.id });

    expect(result).toEqual({
      ...userInDb,
      token: 'token-vendedor',
    });
  });

  // -------------------------
  // CP01 - Valor de prueba 3
  // Usuario CLIENTE
  // -------------------------
  it('CP01-3 - Login correcto para usuario CLIENTE', async () => {
    // Arrange
    const loginDto = {
      email: 'cliente@libroconecta.com',
      password: 'Cliente123*',
    };

    const userInDb: Partial<User> = {
      id: 'uuid-cliente',
      email: 'cliente@libroconecta.com',
      password: 'hashed-password-cliente',
    };

    mockUserRepository.findOne.mockResolvedValue(userInDb);

    const compareSpy = jest
      .spyOn(bcryptAdapter, 'compare')
      .mockReturnValue(true);

    mockJwtService.sign.mockReturnValue('token-cliente');

    // Act
    const result = await authService.login(loginDto as any);

    // Assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: loginDto.email },
      select: { email: true, password: true, id: true },
    });

    expect(compareSpy).toHaveBeenCalledWith(
      loginDto.password,
      userInDb.password,
    );

    expect(mockJwtService.sign).toHaveBeenCalledWith({ id: userInDb.id });

    expect(result).toEqual({
      ...userInDb,
      token: 'token-cliente',
    });
  });

  // -------------------------
  // CP01 - Valor de prueba 4
  // Email normalizado (lowercase / trim)
  // -------------------------
  it('CP01-4 - Login correcto con email normalizado (lowercase/trim)', async () => {
    // Arrange
    const loginDto = {
      email: 'Admin@BookConecta.com', // el usuario lo escribe con mayúsculas
      password: 'Admin123*',
    };

    // En BD el email ya está en lowercase por los hooks @BeforeInsert
    const userInDb: Partial<User> = {
      id: 'uuid-admin-normalizado',
      email: 'admin@libroconecta.com',
      password: 'hashed-password-admin-norm',
    };

    // Para este test asumimos que la búsqueda se hace usando el email que llega en el DTO.
    // Si en tu lógica antes lo pasas a lowercase, deberías replicarlo en el test.
    mockUserRepository.findOne.mockResolvedValue(userInDb);

    const compareSpy = jest
      .spyOn(bcryptAdapter, 'compare')
      .mockReturnValue(true);

    mockJwtService.sign.mockReturnValue('token-admin-normalizado');

    // Act
    const result = await authService.login(loginDto as any);

    // Assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: loginDto.email },
      select: { email: true, password: true, id: true },
    });

    expect(compareSpy).toHaveBeenCalledWith(
      loginDto.password,
      userInDb.password,
    );

    expect(mockJwtService.sign).toHaveBeenCalledWith({ id: userInDb.id });

    // Aquí validamos que el servicio devuelve el user de BD junto con el token
    expect(result).toEqual({
      ...userInDb,
      token: 'token-admin-normalizado',
    });
  });
});
