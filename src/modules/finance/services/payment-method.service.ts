import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { PaymentMethod } from '../entities/payment-method.entity';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from '../dto/update-payment-method.dto';
import { PaymentMethodResponseDto } from '../dto/payment-method-response.dto';
import { PaymentMethodRepository } from '../repositories/payment-method.repository';

@Injectable()
export class PaymentMethodService extends GenericService<
    PaymentMethod,
    CreatePaymentMethodDto,
    UpdatePaymentMethodDto,
    PaymentMethodResponseDto
> {
    constructor(private readonly repo: PaymentMethodRepository) {
        super(repo, 'PaymentMethod');
    }

    toResponseDto(entity: PaymentMethod): PaymentMethodResponseDto {
        const dto = new PaymentMethodResponseDto();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.type = entity.type;
        dto.isActive = entity.isActive;
        dto.requireReference = entity.requireReference;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        return dto;
    }

    toEntity(dto: CreatePaymentMethodDto | UpdatePaymentMethodDto): Partial<PaymentMethod> {
        const entity = new PaymentMethod();
        if (dto.name) entity.name = dto.name;
        if (dto.type) entity.type = dto.type;
        if (dto.isActive !== undefined) entity.isActive = dto.isActive;
        if (dto.requireReference !== undefined) entity.requireReference = dto.requireReference;
        return entity;
    }
}
