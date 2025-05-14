import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Pagination } from 'src/application/pagination/pagination';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(Pagination, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              totalCount: { type: 'number', example: 42 },
              page: { type: 'number', example: 1 },
              pageSize: { type: 'number', example: 10 },
              pagesCount: { type: 'number', example: 5 },
              hasPreviousPage: { type: 'boolean', example: false },
              hasNextPage: { type: 'boolean', example: true },
            },
          },
        ],
      },
    }),
  );
};
