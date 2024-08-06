import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersService} from './users.service';
import {User} from './entity/user.entity';
import {UsersController} from "./users.controller";
import {Role} from "../roles/entity/role.entity";
import {RolesModule} from "../roles/roles.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {JwtModule} from "@nestjs/jwt";
import {getEnv} from "../utils/getenv";
import {RolesGuard} from "../roles/roles.guard";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role]), RolesModule,
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://rabbit:5672'],
                    queue: 'auth_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    JwtModule.register({
        secret: getEnv('JWT_SECRET', 'secret'),
        signOptions: {
            expiresIn: '24h'
        }
    })],

    providers: [UsersService, RolesGuard],
    exports: [
        UsersService,
    ],
    controllers: [UsersController],
})
export class UsersModule {
}
