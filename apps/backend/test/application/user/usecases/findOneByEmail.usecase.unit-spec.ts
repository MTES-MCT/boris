import { Test, TestingModule } from '@nestjs/testing';
import { FindOneByEmailUsecase } from 'src/application/user/usecases/findOneByEmail.usecase';
import { UserView } from 'src/application/user/views/user.view';
import { user1, mockUserRepository } from 'test/mocks/integration/user';
import { NotFoundException } from '@nestjs/common';

describe('FindOneByEmailUsecase', () => {
  let useCase: FindOneByEmailUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneByEmailUsecase,
        {
          provide: 'UserRepositoryInterface',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOneByEmailUsecase>(FindOneByEmailUsecase);
  });

  it('should return user view if user is found', () => {
    mockUserRepository.findOneByEmail.mockReturnValue(user1);

    const expectedResult = new UserView(user1.email);

    const result = useCase.execute({ email: user1.email });

    expect(result).toMatchObject(expectedResult);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(user1.email);
  });

  it('should throw NotFoundException if user is not found', () => {
    mockUserRepository.findOneByEmail.mockReturnValue(null);

    try {
      useCase.execute({ email: 'notfound@example.com' });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
        'notfound@example.com',
      );
    }
  });
});
