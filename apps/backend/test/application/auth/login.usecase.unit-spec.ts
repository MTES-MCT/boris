import { Test, TestingModule } from '@nestjs/testing';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import {
  user1,
  mockUserRepository,
  mockPasswordHasher,
} from 'test/mocks/integration/user';
import { UnauthorizedException } from '@nestjs/common';
import { UserView } from 'src/application/user/views/user.view';

describe('LoginUsecase', () => {
  let useCase: LoginUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUsecase,
        {
          provide: 'UserRepositoryInterface',
          useValue: mockUserRepository,
        },
        {
          provide: 'PasswordHasherInterface',
          useValue: mockPasswordHasher,
        },
      ],
    }).compile();

    useCase = module.get<LoginUsecase>(LoginUsecase);
  });

  it('should login successfully with valid email and password', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(user1);
    mockPasswordHasher.compare.mockResolvedValue(true);

    const expectedResult = new UserView(user1.email);

    const result = await useCase.execute({
      email: user1.email,
      password: user1.password,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(user1.email);
    expect(mockPasswordHasher.compare).toHaveBeenCalledTimes(1);
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      user1.password,
      expect.any(String),
    );
  });

  it('should throw UnauthorizedException when user email does not exist', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(null);
    mockPasswordHasher.compare.mockResolvedValue(true);

    try {
      await useCase.execute({
        email: user1.email,
        password: user1.password,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
        user1.email,
      );
      expect(mockPasswordHasher.compare).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
        user1.password,
        expect.any(String),
      );
    }
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(user1);
    mockPasswordHasher.compare.mockResolvedValue(false);

    try {
      await useCase.execute({
        email: user1.email,
        password: user1.password,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
        user1.email,
      );
      expect(mockPasswordHasher.compare).toHaveBeenCalledTimes(1);
      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
        user1.password,
        expect.any(String),
      );
    }
  });
});
