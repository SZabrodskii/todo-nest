import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './modules/todo/todo.module';
import { ProjectModule } from './modules/todo/project.module';
import { ColumnModule } from './modules/todo/column.module';
import { getEnv } from './utils/getenv';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

@Module({
    imports: [
        UsersModule,
        RolesModule,
        TodoModule,
        ProjectModule,
        ColumnModule,
        TypeOrmModule.forRoot({
            type: getEnv('TYPEORM_CONNECTION', 'postgres'),
            host: getEnv('DB_HOST', 'localhost'),
            port: getEnv('DB_PORT', 5432),
            username: getEnv('DB_USER', 'admin'),
            password: getEnv('DB_PASSWORD', 'postgres'),
            database: getEnv('DB_NAME', 'authPostgres'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            migrationsTableName: 'migrations_typeorm',
        }),
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
            {
                name: 'TODO_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'todo_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}