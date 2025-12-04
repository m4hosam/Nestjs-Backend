import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseWrapper = <TModel extends Type<any>>(
  model: TModel,
  isArray = false,
  isPaginated = false,
) => {
  if (isPaginated) {
    return applyDecorators(
      ApiOkResponse({
        schema: {
          allOf: [
            {
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'object',
                  properties: {
                    data: {
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
                timestamp: { type: 'string', format: 'date-time' },
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
              success: { type: 'boolean', example: true },
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
    }),
  );
};
