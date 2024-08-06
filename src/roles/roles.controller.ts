import {Controller, Post, Body, Get, Param} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entity/role.entity';
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('roles')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @ApiOperation({summary: 'Create role'})
    create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.rolesService.createRole(createRoleDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all roles'})
    findAll(): Promise<Role[]> {
        return this.rolesService.findAll();
    }

    @Get('/:value')
    @ApiOperation({summary: 'Get role by value'})
    getRoleByValue(@Param('value') value: string): Promise<Role> {
        return this.rolesService.getRoleByValue(value);
    }
}