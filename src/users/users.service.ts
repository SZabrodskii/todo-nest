import {HttpException, HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";


@Injectable()
export class UsersService {
    @Client({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://rabbit:5672'],
            queue: 'auth_queue',
            queueOptions: {
                durable: false,
            },
        },
    })
    private readonly client: ClientProxy

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly rolesService: RolesService
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const role = await this.rolesService.getRoleByValue('USER');
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        const user = await this.usersRepository.create({ ...dto, roles: [role] });
        await this.usersRepository.save(user);
        return user
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.usersRepository.find();
        if (!users.length) {
            throw new NotFoundException('Users not found');
        }
        return users
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {email},
            relations: ['roles'],
        });
        return user
    }

    async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
        const user = await this.usersRepository.findOne({where: {id: dto.userId}, relations: ['roles']})
        const role = await this.rolesService.getRoleByValue(dto.value);
        if (role && user) {
            user.roles.push(role);
            await this.usersRepository.save(user);
            return dto
        }
        throw new HttpException("User or role not found", HttpStatus.NOT_FOUND)
    }

    async sendMessage(pattern: string, data: any) {
        return lastValueFrom(this.client.send(pattern, data));
    }

    async validateUser(data: any) {
        return this.client.send('validate_user', data).toPromise();
    }
}
