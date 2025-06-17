import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveUserUseCase } from 'src/application/user/usecases/save.usecase';
import { UserView } from 'src/application/user/views/user.view';
import {
  mockPasswordHasher,
  mockUserRepository,
  user1,
} from 'test/mocks/integration/user';

describe('SaveUserUsecase', () => {
  let useCase: SaveUserUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveUserUseCase,
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

    useCase = module.get<SaveUserUseCase>(SaveUserUseCase);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should save a user and return its data', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(user1);
    mockPasswordHasher.hash.mockResolvedValue('password');

    const expectedResult = new UserView(user1.email);

    const result = await useCase.execute({
      email: user1.email,
      password: user1.password,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(user1.email);
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  it.skip('should fail if a user with the same email already exists', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(user1);
    mockUserRepository.save.mockResolvedValue(user1);
    mockPasswordHasher.hash.mockResolvedValue('password');

    try {
      await useCase.execute({ email: user1.email, password: user1.password });
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
        user1.email,
      );
      expect(mockUserRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});
