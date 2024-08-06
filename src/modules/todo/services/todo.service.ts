import {Injectable, NotFoundException} from '@nestjs/common';
import {Todo} from "../entities/todo.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {CreateTodoDto, UpdateTodoDto} from "../dto/todo.dto";
import {ColumnService} from "./column.service";


@Injectable()
export class TodoService{

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
        private readonly columnService: ColumnService,
    ) {}

    async findOne(id: string): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id: parseInt(id, 10) } });
        if (!todo) {
            throw new NotFoundException('Todo not found');
        }
        return todo;
    }

    async findAll(): Promise<Todo[]> {
        const result = await this.todoRepository.find();
        if (!result) {
            throw new NotFoundException('Todo not found');
        }
        return result;
    }

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        const column = await this.columnService.findOne(createTodoDto.columnId.toString());
        if (!column) {
            throw new NotFoundException('Column not found');
        }

        const todo = new Todo();
        todo.title = createTodoDto.title;
        todo.isCompleted = createTodoDto.isCompleted ?? false;
        todo.column = column;
        todo.order = createTodoDto.order ?? 0
        return this.todoRepository.save(todo);
    }

    async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id: parseInt(id, 10) }, relations: ['column'] });
        if (!todo) {
            throw new NotFoundException('Todo not found');
        }
        Object.assign(todo, updateTodoDto);
        return this.todoRepository.save(todo);
    }

    async remove(id: number): Promise<DeleteResult> {
        const result = await this.todoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Todo not found');
        }
        return result;
    }

    async moveTodo(
        todoId: number,
        newColumnId: number,
        newOrder: number
    ): Promise<void> {
        const todo = await this.todoRepository.findOne({where: {id: todoId}})
        if(!todo){
            throw new NotFoundException('Todo not found');
        }
        await this.todoRepository.createQueryBuilder()
            .update(Todo)
            .set({order: () => `"order" - 1`})
            .where('columnId = :columnId AND "order" > :order', {columnId: todo.columnId, order: todo.order})
            .execute();

        await this.todoRepository.createQueryBuilder()
            .update(Todo)
            .set({order: () => `"order" + 1`})
            .where('columnId = :newColumnId AND "order" >= :newOrder', {newColumnId, newOrder})
            .execute();

        todo.columnId = newColumnId;
        todo.order = newOrder;
        await this.todoRepository.save(todo);
    }


}