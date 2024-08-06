import {Injectable, NotFoundException} from "@nestjs/common";
import {Project} from "../entities/project.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {CreateProjectDto, UpdateProjectDto} from "../dto/project.dto";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {
    }

    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find({relations: ['columns', 'columns.todos']});
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne(
            {
                where: {id},
                relations: ['columns', 'columns.todos']
            });
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return project;
    }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const project = await this.projectRepository.create(createProjectDto);
        return this.projectRepository.save(project);
    }

    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = await this.projectRepository.findOne({where: {id: parseInt(id, 10)}});
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        Object.assign(project, updateProjectDto);
        return this.projectRepository.save(project);
    }

    async remove(id: number): Promise<DeleteResult> {

        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Project not found');
        }

        return result;
    }
}
