import {Body, Controller, Delete, Get, HttpException, Param, Post, Put} from "@nestjs/common";
import {TodoService} from "../services/todo.service";
import {Todo} from "../entities/todo.entity";
import {CreateTodoDto, UpdateTodoDto} from "../dto/todo.dto";
import {DeleteResult} from "typeorm";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('todo')
@Controller('/todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Get()
    @ApiResponse({status: 200, description: "Get all todos", type: [Todo]})
    getTodos(): Promise<Todo[]> {
        return this.todoService.findAll();
    }

    @Get('/:id')
    @ApiResponse({status: 200, description: "Get todo by ID", type: Todo})
    @ApiResponse({status: 404, description: "Not found"})
    getOneTodo(@Param('id') id: string) {
       const todo = this.todoService.findOne(id);
       if(!todo) {
           throw new HttpException('Todo not found', 404)
       }
       return todo
    }

    @Post()
    @ApiResponse({status: 200, description: "Create a new todo", type: Todo})
    @ApiBody({type: CreateTodoDto})
    createTodo(@Body() dto: CreateTodoDto): Promise<Todo> {
        return this.todoService.create(dto)
    };

    @Put('/:id')
    @ApiResponse({status: 200, description: "Update todo", type: Todo})
    @ApiResponse({status: 404, description: "Not found"})
    @ApiBody({type: UpdateTodoDto})
    updateTodo(@Param('id') id: string, @Body() dto: UpdateTodoDto): Promise<Todo> {
        return this.todoService.update(id, dto)
    }

    @Put('/:todoId/move')
    @ApiResponse({status: 200, description: "Move todo"})
    moveTodo(
        @Param('todoId') todoId: number,
        @Body('newColumnId') newColumnId: number,
        @Body('newOrder') newOrder: number
    ) {
        this.todoService.moveTodo(todoId, newColumnId, newOrder);
    }

    @Delete('/:id')
    @ApiResponse({status: 200, description: "Delete todo", type: DeleteResult})
    @ApiResponse({status: 404, description: "Not found"})
    deleteTodo(@Param('id') id: number): Promise<DeleteResult> {
        const todo = this.todoService.findOne(id.toString());
        if(!todo) {
            throw new HttpException('Todo not found', 404);
        }
        return this.todoService.remove(id);
    }
}