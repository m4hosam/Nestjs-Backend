import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentMethodService } from '../services/payment-method.service';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from '../dto/update-payment-method.dto';
import { PaymentMethodResponseDto } from '../dto/payment-method-response.dto';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleEnum } from '../../../common/enums/roles.enum';

@ApiTags('Finance - Payment Methods')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('finance/payment-methods')
export class PaymentMethodController {
    constructor(private readonly service: PaymentMethodService) { }

    @Post()
    @Roles(RoleEnum.Admin, RoleEnum.Manager)
    @ApiResponseWrapper(PaymentMethodResponseDto)
    create(@Body() dto: CreatePaymentMethodDto, @Req() req: any) {
        return this.service.create(dto, req.user?.id);
    }

    @Get()
    @ApiResponseWrapper(PaymentMethodResponseDto, true, true)
    findAll(@Query() query: BaseFilterDto) {
        return this.service.findWithPagination(
            { page: query.page, limit: query.limit },
            { order: { [query.sortBy as string]: query.sortOrder } },
        );
    }

    @Get(':id')
    @ApiResponseWrapper(PaymentMethodResponseDto)
    findOne(@Param('id') id: string) {
        return this.service.findById(+id);
    }

    @Patch(':id')
    @Roles(RoleEnum.Admin, RoleEnum.Manager)
    @ApiResponseWrapper(PaymentMethodResponseDto)
    update(
        @Param('id') id: string,
        @Body() dto: UpdatePaymentMethodDto,
        @Req() req: any,
    ) {
        dto.id = +id;
        return this.service.update(dto, req.user?.id);
    }

    @Delete(':id')
    @Roles(RoleEnum.Admin)
    @ApiResponseWrapper(Boolean)
    remove(@Param('id') id: string) {
        return this.service.softDelete(+id);
    }
}
