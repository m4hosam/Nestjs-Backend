import { Controller, Get, Param, Query, ParseIntPipe, UseGuards, Put, Body, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { KitchenTicketService } from '../services/kitchen-ticket.service';
import { KitchenTicketResponseDto, UpdateKitchenTicketDto } from '../dto/kitchen-ticket.dto';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Restaurant Operations - Kitchen Tickets')
@ApiBearerAuth()
@Controller('operations/restaurant/kitchen-tickets')
@UseGuards(JwtAuthGuard)
export class KitchenTicketController {
    constructor(private readonly kitchenTicketService: KitchenTicketService) { }

    @Get()
    @ApiResponseWrapper(KitchenTicketResponseDto, true, true)
    async findAll(@Query() filterDto: BaseFilterDto): Promise<PaginatedResult<KitchenTicketResponseDto>> {
        return this.kitchenTicketService.findWithPagination(
            { page: filterDto.page, limit: filterDto.limit },
            { order: { [filterDto.sortBy as string]: filterDto.sortOrder } }
        );
    }

    @Get(':id')
    @ApiResponseWrapper(KitchenTicketResponseDto)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<KitchenTicketResponseDto> {
        return this.kitchenTicketService.findById(id);
    }

    @Put(':id')
    @ApiResponseWrapper(KitchenTicketResponseDto)
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateKitchenTicketDto,
        @Req() req: any
    ): Promise<KitchenTicketResponseDto> {
        updateDto.id = id;
        return this.kitchenTicketService.update(updateDto, req.user?.id);
    }

    // Note: routeOrderItemsToKot is typically called internally by the Sales/Order module, 
    // but if exposed via API, it would accept the Order object.
}
