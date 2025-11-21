// src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { bcryptAdapter } from '../helper/AdapterBcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  // Mocks de dependencias compartidos por todos los CP
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

    jest.clearAllMocks();
  });

  // =========================================================
  // CP01 - Acceso al sistema (login correcto)
  // =========================================================
  describe('CP01 - Login correcto', () => {
    it('CP01-1 - Login correcto para usuario ADMIN', async () => {
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

      const result = await authService.login(loginDto as any);

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

    it('CP01-2 - Login correcto para usuario VENDEDOR', async () => {
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

      const result = await authService.login(loginDto as any);

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

    it('CP01-3 - Login correcto para usuario CLIENTE', async () => {
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

      const result = await authService.login(loginDto as any);

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

    it('CP01-4 - Login correcto con email normalizado (lowercase/trim)', async () => {
      const loginDto = {
        email: 'Admin@BookConecta.com',
        password: 'Admin123*',
      };

      const userInDb: Partial<User> = {
        id: 'uuid-admin-normalizado',
        email: 'admin@libroconecta.com',
        password: 'hashed-password-admin-norm',
      };

      mockUserRepository.findOne.mockResolvedValue(userInDb);

      const compareSpy = jest
        .spyOn(bcryptAdapter, 'compare')
        .mockReturnValue(true);

      mockJwtService.sign.mockReturnValue('token-admin-normalizado');

      const result = await authService.login(loginDto as any);

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
        token: 'token-admin-normalizado',
      });
    });
  });

  // =========================================================
  // CP02 - Denegación de acceso (credenciales erróneas)
  // =========================================================
  describe('CP02 - Denegación de acceso (credenciales erróneas)', () => {
    // Valor de prueba 1: email correcto, password incorrecta
    it('CP02-1 - Password incorrecta para un email existente', async () => {
      const loginDto = {
        email: 'admin@libroconecta.com',
        password: 'ClaveIncorrecta',
      };

      const userInDb: Partial<User> = {
        id: 'uuid-admin',
        email: 'admin@libroconecta.com',
        password: 'hashed-password-admin',
      };

      mockUserRepository.findOne.mockResolvedValue(userInDb);

      const compareSpy = jest
        .spyOn(bcryptAdapter, 'compare')
        .mockReturnValue(false);

      await expect(authService.login(loginDto as any)).rejects.toThrow(
        new UnauthorizedException('Credentials are not valid (password)'),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: { email: true, password: true, id: true },
      });

      expect(compareSpy).toHaveBeenCalledWith(
        loginDto.password,
        userInDb.password,
      );

      // No debe firmar token si la contraseña es incorrecta
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    // Valor de prueba 2: email correcto, password vacía
    it('CP02-2 - Password vacía para un email existente', async () => {
      const loginDto = {
        email: 'cliente@libroconecta.com',
        password: '',
      };

      const userInDb: Partial<User> = {
        id: 'uuid-cliente',
        email: 'cliente@libroconecta.com',
        password: 'hashed-password-cliente',
      };

      mockUserRepository.findOne.mockResolvedValue(userInDb);

      const compareSpy = jest
        .spyOn(bcryptAdapter, 'compare')
        .mockReturnValue(false);

      await expect(authService.login(loginDto as any)).rejects.toThrow(
        new UnauthorizedException('Credentials are not valid (password)'),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: { email: true, password: true, id: true },
      });

      expect(compareSpy).toHaveBeenCalledWith(
        loginDto.password,
        userInDb.password,
      );

      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    // Valor de prueba 3: email NO registrado
    it('CP02-3 - Email no registrado en el sistema', async () => {
      const loginDto = {
        email: 'noexiste@libroconecta.com',
        password: 'Cualquier123*',
      };

      // No se encuentra usuario en BD
      mockUserRepository.findOne.mockResolvedValue(null);

      const compareSpy = jest.spyOn(bcryptAdapter, 'compare');

      await expect(authService.login(loginDto as any)).rejects.toThrow(
        new UnauthorizedException('Credentials are not valid (email)'),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: { email: true, password: true, id: true },
      });

      // No debe intentar comparar contraseña si el usuario no existe
      expect(compareSpy).not.toHaveBeenCalled();

      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    // Valor de prueba 4: email con otro dominio (no existe)
    it('CP02-4 - Email con dominio incorrecto (usuario inexistente)', async () => {
      const loginDto = {
        email: 'admin@otrodominio.com',
        password: 'Admin123*',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      const compareSpy = jest.spyOn(bcryptAdapter, 'compare');

      await expect(authService.login(loginDto as any)).rejects.toThrow(
        new UnauthorizedException('Credentials are not valid (email)'),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: { email: true, password: true, id: true },
      });

      expect(compareSpy).not.toHaveBeenCalled();

      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});
