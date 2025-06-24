import { validate } from 'class-validator';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';

describe('PaginationDTO', () => {
  it('should be valid', async () => {
    const dto = new PaginationDTO();
    dto.page = 1;

    const validation = await validate(dto);
    expect(validation).toHaveLength(0);
  });

  it('should fail when page is smaller than 1', async () => {
    const dto = new PaginationDTO();
    dto.page = -1;

    const validation = await validate(dto);
    expect(validation).toHaveLength(1);
    expect(validation[0].constraints).toMatchObject({
      min: 'page must not be less than 1',
    });
  });

  it('should fail when pageSize is smaller than 1', async () => {
    const dto = new PaginationDTO();
    dto.pageSize = -1;

    const validation = await validate(dto);
    expect(validation).toHaveLength(1);
    expect(validation[0].constraints).toMatchObject({
      min: 'pageSize must not be less than 1',
    });
  });

  it('should fail when pageSize is greater than 50', async () => {
    const dto = new PaginationDTO();
    dto.pageSize = MAX_PAGE_SIZE + 1;

    const validation = await validate(dto);
    expect(validation).toHaveLength(1);
    expect(validation[0].constraints).toMatchObject({
      max: `pageSize must not be greater than ${MAX_PAGE_SIZE}`,
    });
  });
});
