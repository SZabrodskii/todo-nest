import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ColumnEntity} from "../entities/column.entity";
import {DeleteResult, Repository} from "typeorm";
import {ProjectService} from "./project.service";
import {CreateColumnDto, UpdateColumnDto} from "../dto/column.dto";


@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(ColumnEntity)
        private readonly columnRepository: Repository<ColumnEntity>,
        private readonly projectService: ProjectService,
    ) {}

    async findAll(): Promise<ColumnEntity[]> {
        return await this.columnRepository.find({ relations: ['project', 'todos'] });
    }

    async findOne(id: string): Promise<ColumnEntity> {
        const column = await this.columnRepository.findOne({ where: { id: parseInt(id, 10) }, relations: ['project', 'todos'] });
        if (!column) {
            throw new NotFoundException('Column not found');
        }
        return column;
    }

    async create(createColumnDto: CreateColumnDto): Promise<ColumnEntity> {
        const project = await this.projectService.findOne(createColumnDto.projectId);
        const column = new ColumnEntity();
        column.title = createColumnDto.title;
        column.projectId = createColumnDto.projectId;
        column.project = project;
        column.order = createColumnDto.order ?? 0
        return this.columnRepository.save(column);
    }

    async update(id: string, updateColumnDto: UpdateColumnDto): Promise<ColumnEntity> {
        const column = await this.findOne(id);
        if (!column) {
            throw new NotFoundException('Column not found');
        }
        Object.assign(column, updateColumnDto);
        return this.columnRepository.save(column);
    }

    async remove(id: string): Promise<DeleteResult> {
        const result = await this.columnRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Column not found');
        }

        return result;
    }

    async moveColumn(projectId: number, columnId: number, newOrder: number): Promise<void>{
        const columns = await this.columnRepository.find({where: {projectId}, order: {order: 'ASC'}});
        const columnToMove = columns.find(column => column.id === columnId);
        if (!columnToMove) {
            throw new NotFoundException('Column not found');
        }
        columns.splice(columns.indexOf(columnToMove), 1);
        columns.splice(newOrder, 0, columnToMove);
        for (let i = 0; i < columns.length; i++) {
            columns[i].order = i;
        }
        await this.columnRepository.save(columns);
    }
}