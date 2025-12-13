import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentTransactionService } from '../services/payment-transaction.service';
import { ProcessTransactionRequestDto } from '../dto/process-transaction-request.dto';
import { PaymentTransactionResponseDto } from '../dto/payment-transaction-response.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Finance - Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/transactions')
export class PaymentTransactionController {
    constructor(private readonly service: PaymentTransactionService) { }

    @Post('process')
    @ApiOperation({ summary: 'Process a payment transaction' })
    @ApiResponseWrapper(PaymentTransactionResponseDto)
    processPayment(
        @Body() dto: ProcessTransactionRequestDto,
        @Req() req: any,
    ) {
        return this.service.processPayment(dto, req.user?.id);
    }
}
