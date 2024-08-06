import {Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe} from '@nestjs/common';
import { ColumnService } from '../services/column.service';
import { CreateColumnDto } from '../dto/column.dto';
import { UpdateColumnDto } from '../dto/column.dto';
import { ColumnEntity } from '../entities/column.entity';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import {DeleteResult} from "typeorm";

@ApiTags('columns')
@Controller('columns')
export class ColumnController {
    constructor(private readonly columnService: ColumnService) {}

    @Get()
    @ApiResponse({ status: 200, description: "Get all columns", type: [ColumnEntity] })
    getColumns(): Promise<ColumnEntity[]> {
        return this.columnService.findAll();
    }

    @Get('/:id')
    @ApiResponse({ status: 200, description: "Get column by ID", type: ColumnEntity })
    @ApiResponse({ status: 404, description: "Not found" })
    getColumn(@Param('id') id: string): Promise<ColumnEntity> {
        return this.columnService.findOne(id);
    }

    @Post()
    @ApiResponse({ status: 201, description: "Create a new column", type: ColumnEntity })
    @ApiBody({ type: CreateColumnDto })
    createColumn(@Body() createColumnDto: CreateColumnDto): Promise<ColumnEntity> {
        return this.columnService.create(createColumnDto);
    }

    @Put('/:id')
    @ApiResponse({ status: 200, description: "Update column", type: ColumnEntity })
    @ApiBody({ type: UpdateColumnDto })
    updateColumn(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto): Promise<ColumnEntity> {
        return this.columnService.update(id, updateColumnDto);
    }

    @Put(':projectId/:columnId/move')
    moveColumn(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Body('newOrder', ParseIntPipe) newOrder: number
    ){
         this.columnService.moveColumn(projectId, columnId, newOrder);
    }

    @Delete('/:id')
    @ApiResponse({ status: 204, description: "Delete column" })
    deleteColumn(@Param('id') id: string): Promise<DeleteResult> {
        return this.columnService.remove(id);
    }
}
