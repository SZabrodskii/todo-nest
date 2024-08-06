import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) {}

    async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const role = this.rolesRepository.create(createRoleDto);
        return this.rolesRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        const roles = await this.rolesRepository.find();
        if (!roles.length) {
            throw new NotFoundException('Roles not found');
        }
        return roles
    }

    async getRoleByValue(value: string): Promise<Role> {
        const role = await this.rolesRepository.findOneBy({value});
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role
    }
}