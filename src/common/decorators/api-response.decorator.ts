import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseWrapper = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
  isPaginated = false,
) => {
  if (isPaginated) {
    return applyDecorators(
      ApiExtraModels(model), // 👈 السطر ده هو الحل السحري! بيعرف Swagger على الـ DTO
      ApiOkResponse({
        schema: {
          allOf: [
            {
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                      },
                    },
                  },
                },
                error: { type: 'object', nullable: true, example: null },
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
              error: { type: 'object', nullable: true, example: null },
            },
          },
        ],
      },
    }),
  );
};
