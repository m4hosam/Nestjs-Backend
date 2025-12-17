import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryTransactionService } from '../services/inventory-transaction.service';
import { CreateTransactionRequestDto } from '../dto/create-transaction.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
// Assuming JwtAuthGuard exists based on dev guide
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
    constructor(private readonly inventoryService: InventoryTransactionService) { }

    @Get('stock/:warehouseId/:productId')
    @ApiOperation({ summary: 'Get current stock quantity for a product in a warehouse' })
    async getStock(
        @Param('warehouseId', ParseIntPipe) warehouseId: number,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        return this.inventoryService.getCurrentStock(warehouseId, productId);
    }

    @Post('transaction')
    @ApiOperation({ summary: 'Record a general inventory transaction' })
    @ApiResponseWrapper(InventoryTransaction)
    @HttpCode(HttpStatus.CREATED)
    async recordTransaction(@Body() dto: CreateTransactionRequestDto, @Req() req: any) {
        return this.inventoryService.recordTransaction(dto, req.user?.id);
    }

    @Post('sales-deduction')
    @ApiOperation({ summary: 'Process sales deduction (handles composite products)' })
    @ApiResponseWrapper(InventoryTransaction) // Returns the final transaction or success
    @HttpCode(HttpStatus.OK)
    async processSalesDeduction(@Body() dto: CreateTransactionRequestDto, @Req() req: any) {
        await this.inventoryService.processSalesDeduction(dto, req.user?.id);
        // Since processSalesDeduction might create multiple transactions, we return a success status
        // or specific DTO. For now, returning success via Interceptor.
        return { message: 'Sales deduction processed successfully' };
    }
}
