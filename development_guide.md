# Development Guide

This guide provides a comprehensive overview of the project architecture and step-by-step instructions for implementing new features.

## 1. Architecture Overview

The project follows a modular, layered architecture using NestJS.

### Layers

1.  **Controllers (`src/modules/*/controllers`)**: Handle HTTP requests, validation, and response formatting.
2.  **Services (`src/modules/*/services`)**: Contain business logic. Extend `GenericService` for common CRUD operations.
3.  **Repositories (`src/repositories`)**: Handle database interactions. Extend `GenericRepository` for common DB operations.
4.  **Entities (`src/entities`)**: Define database schema. Extend `BaseTransactionEntity`.
5.  **DTOs (`src/modules/*/dto`)**: Define data transfer objects for validation.

## 2. Directory Structure

```
src/
├── common/             # Shared utilities (decorators, filters, guards, etc.)
├── config/             # Configuration files
├── entities/           # Database entities
│   ├── base/           # Base entities
│   └── [feature]/      # Feature-specific entities
├── modules/            # Feature modules
│   └── [feature]/
│       ├── controllers/
│       ├── dto/
│       ├── services/
│       └── [feature].module.ts
├── repositories/       # Custom repositories
│   ├── generic/        # Generic repository base
│   └── [feature]/      # Feature-specific repositories
└── services/           # Shared services
    └── generic/        # Generic service base
```

## 3. Step-by-Step Feature Implementation

To add a new feature (e.g., `Products`), follow these steps:

### Step 1: Create Entity

Create `src/entities/products/product.entity.ts`:

```typescript
import { Entity, Column } from 'typeorm';
import { BaseTransactionEntity } from '../base/base-transaction.entity';

@Entity({ name: 'products' })
export class Product extends BaseTransactionEntity {
  @Column()
  name: string;
  // ... other columns
}
```

### Step 2: Create Repository

Create `src/repositories/products/product.repository.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../generic/generic.repository';
import { Product } from '../../entities/products/product.entity';

@Injectable()
export class ProductRepository extends GenericRepository<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {
    super(repo);
  }
}
```

### Step 3: Create DTOs

Create DTOs in `src/modules/products/dto/`:

- `create-product.dto.ts`
- `update-product.dto.ts`
- `product-response.dto.ts`

### Step 4: Create Service

Create `src/modules/products/services/products.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { GenericService } from '../../services/generic/generic.service';
import { Product } from '../../entities/products/product.entity';
import { ProductRepository } from '../../repositories/products/product.repository';
// ... import DTOs

@Injectable()
export class ProductsService extends GenericService<
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto
> {
  constructor(private readonly repo: ProductRepository) {
    super(repo, 'Product');
  }

  // Implement abstract methods: toResponseDto, toEntity, findEntityById
}
```

### Step 5: Create Controller

Create `src/modules/products/controllers/products.controller.ts`:

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// ... imports

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // Implement endpoints using @Get, @Post, etc.
  // Use @ApiResponseWrapper for consistent responses
}
```

### Step 6: Create Module

Create `src/modules/products/products.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/products/product.entity';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductRepository } from '../../repositories/products/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### Step 7: Register Module

Import `ProductsModule` in `src/app.module.ts`.

## 4. Common Patterns & Best Practices

- **Generic Service/Repository**: Always extend these to inherit basic CRUD functionality (pagination, filtering, soft delete).
- **Response Wrapper**: Use `@ApiResponseWrapper` decorator on controller methods to ensure consistent JSON response structure.
- **Validation**: Use `class-validator` decorators in DTOs.
- **Error Handling**: Use `ErrorMessages` constants and throw custom exceptions (e.g., `BusinessValidationException`). The global filter will handle it.
- **Environment Variables**: Access config via `ConfigService`. Ensure new variables are added to `.env.example`.

## 5. Error Handling Standards

We use a centralized error handling approach to ensure consistency across the application.

### 5.1. Define Error Messages

All error messages should be defined in `src/common/constants/error-messages.constants.ts`.

```typescript
export const ErrorMessages = {
  // ...
  UserNotFound: {
    key: 'AUTH_USER_NOT_FOUND',
    message: 'User not found.',
  },
  // ...
};
```

### 5.2. Throw Exceptions

Use the custom exception classes in `src/common/exceptions/` and pass the ErrorMessage object.

- **BusinessValidationException**: For logic validation errors (HTTP 400).
- **ConflictException**: For resource conflicts, e.g., duplicate unique fields (HTTP 409).
- **NotFoundException**: For missing resources (HTTP 404).
- **ForbiddenException**: For permission issues (HTTP 403).

**Example:**

```typescript
import { ErrorMessages } from '../../../common/constants/error-messages.constants';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';

// ...

if (skuExists) {
  throw new BusinessValidationException(ErrorMessages.SkuAlreadyExists);
}
```

## 6. Troubleshooting

- **Database Connection**: Check `.env` credentials. Ensure PostgreSQL is running.
- **Missing Config**: If you see "Configuration key ... does not exist", check your `.env` file against `.env.example`.
