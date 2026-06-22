import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordUsecase } from 'src/application/user/usecases/change-password.usecase';
import {
  mockPasswordHasher,
  mockUserRepository,
  user1,
} from 'test/mocks/integration/user';

describe('ChangePasswordUsecase', () => {
  let useCase: ChangePasswordUsecase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordUsecase,
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

    useCase = module.get<ChangePasswordUsecase>(ChangePasswordUsecase);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    Object.assign(user1, {
      id: 'user-id',
      isActive: true,
      password: 'password',
    });
  });

  it('should change the password when the current password is valid', async () => {
    mockUserRepository.findById.mockResolvedValue(user1);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockPasswordHasher.hash.mockResolvedValue('new-hashed-password');

    await useCase.execute(user1.id, 'current-password', 'new-password');

    expect(mockUserRepository.findById).toHaveBeenCalledWith(user1.id);
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      'current-password',
      'password',
    );
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('new-password');
    expect(mockUserRepository.save).toHaveBeenCalledWith({
      ...user1,
      password: 'new-hashed-password',
    });
  });

  it('should reject an invalid current password', async () => {
    mockUserRepository.findById.mockResolvedValue(user1);
    mockPasswordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute(user1.id, 'wrong-password', 'new-password'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
