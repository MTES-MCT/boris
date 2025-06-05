import { Test, TestingModule } from '@nestjs/testing';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import { user1, mockUserRepository } from 'test/mocks/integration/user';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUserView } from 'src/application/user/views/authenticated.view';

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
      ],
    }).compile();

    useCase = module.get<LoginUsecase>(LoginUsecase);
  });

  it('should login successfully with valid credentials', () => {
    mockUserRepository.findOneByEmail.mockReturnValue(user1);

    const expectedResult = new AuthenticatedUserView(user1.email);

    const result = useCase.execute(user1);

    expect(result).toMatchObject(expectedResult);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(user1.email);
  });

  it('should throw UnauthorizedException when user is not found', () => {
    mockUserRepository.findOneByEmail.mockReturnValue(null);

    try {
      useCase.execute(user1);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
        user1.email,
      );
    }
  });
});
