import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Todo} from "./entities/todo.entity";
import {TodoController} from "./controllers/todo.controller";
import {TodoService} from "./services/todo.service";
import {ColumnModule} from "./column.module";

@Module({
    controllers: [TodoController],
    providers: [TodoService],
    imports: [TypeOrmModule.forFeature([Todo]), ColumnModule],
    exports: [TodoService]
})
export class TodoModule {}
