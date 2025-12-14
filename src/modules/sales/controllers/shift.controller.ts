import { Controller, Post, Body, Req, UseGuards, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ShiftService } from '../services/shift.service';
import { CreateShiftDto } from '../dto/create-shift.dto';
import { CloseShiftDto } from '../dto/close-shift.dto';
import { ShiftResponseDto } from '../dto/shift-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'; // Assuming this exists
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';

@ApiTags('Sales - Shifts')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('shifts')
export class ShiftController {
    constructor(private readonly shiftService: ShiftService) { }

    @Post('open')
    @ApiOperation({ summary: 'Open a new shift for the current user' })
    @ApiResponseWrapper(ShiftResponseDto)
    async openShift(@Body() dto: CreateShiftDto) {
        const userId = 1; // Hardcoded user ID for testing
        return this.shiftService.openShift(dto, userId);
    }

    @Post('close')
    @ApiOperation({ summary: 'Close a shift' })
    @ApiResponseWrapper(ShiftResponseDto)
    async closeShift(@Body() dto: CloseShiftDto, @Req() req: any): Promise<ShiftResponseDto> {
        return this.shiftService.closeShift(dto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all shifts with pagination' })
    @ApiResponseWrapper(ShiftResponseDto, true, true)
    async findAll(@Query() query: BaseFilterDto) {
        return this.shiftService.findWithPagination(query, {
            order: { [query.sortBy as string]: query.sortOrder }
        });
    }

    @Get('user/:id/active')
    async getActiveShift(@Param('id') id: string) {
        // Mock logic for testing POS
        const userId = id === 'current-user-id' ? 1 : +id;
        return this.shiftService.findActiveShiftByUser(userId);
    }
}
