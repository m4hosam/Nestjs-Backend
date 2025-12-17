import { Controller, Post, Body, Req, UseGuards, Param, Patch, ParseIntPipe, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ManagerAuthDto } from '../dto/manager-auth.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';

@ApiTags('Sales - Orders')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponseWrapper(OrderResponseDto)
    async create(@Body() dto: CreateOrderDto) {
        const userId = 1; // Hardcoded user ID for testing
        return this.orderService.createOrder(dto, userId);
    }

    @Patch(':id/complete')
    @ApiOperation({ summary: 'Complete an order (payment received)' })
    @ApiResponseWrapper(OrderResponseDto)
    async complete(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<OrderResponseDto> {
        return this.orderService.completeOrder(id, req.user.id);
    }

    @Post(':id/void')
    @ApiOperation({ summary: 'Void an order (requires manager PIN)' })
    @ApiResponseWrapper(OrderResponseDto)
    async voidOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body() managerDto: ManagerAuthDto,
        @Req() req: any
    ): Promise<OrderResponseDto> {
        return this.orderService.voidOrder(id, managerDto, req.user.id);
    }

    @Post(':id/discount')
    @ApiOperation({ summary: 'Apply discount to order (requires manager PIN)' })
    @ApiResponseWrapper(OrderResponseDto)
    async applyDiscount(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { amount: number; auth: ManagerAuthDto },
        @Req() req: any
    ): Promise<OrderResponseDto> {
        return this.orderService.applyDiscount(id, body.amount, body.auth, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'List orders' })
    @ApiResponseWrapper(OrderResponseDto, true, true)
    async findAll(@Query() query: BaseFilterDto) {
        return this.orderService.findWithPagination(query, {
            relations: ['items', 'items.modifiers'],
            order: { [query.sortBy as string]: query.sortOrder }
        });
    }
}
