import {Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./entity/user.entity";
import {AddRoleDto} from "./dto/add-role.dto";
import {Roles} from "../roles/roles-auth.decorator";
import {RolesGuard} from "../roles/roles.guard";
import {MessagePattern} from "@nestjs/microservices";


@ApiTags('users')
@Controller('/users')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @Post()
    @ApiOperation({summary: 'Create user'})
    @ApiResponse({status: 200, type: User})
    @ApiBody({type: CreateUserDto})
    @UsePipes(ValidationPipe)
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto)
    }

    @Get()
    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    getAll(): Promise<User[]> {
        return this.usersService.getAllUsers()
    }

    @Post('/role')
    @ApiOperation({summary: 'Give the role to the user'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    addRole(@Body() dto: AddRoleDto) {
        {
            return this.usersService.addRole(dto)
        }

    }

    @MessagePattern("create_user_pattern")
    async handleCreateUser(userDto: CreateUserDto) {

    }
}