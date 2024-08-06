import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    HttpException,
    ParseIntPipe,
    NotFoundException
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import { Project } from '../entities/project.entity';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';


@ApiTags('project')
@Controller('/projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Get all projects', type: [Project] })
    findAll(): Promise<Project[]> {
        return this.projectService.findAll();
    }

    @Get('/:id')
    @ApiResponse({ status: 200, description: 'Get project by ID', type: Project })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: number): Promise<Project> {
        const project = this.projectService.findOne(id);
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return project;
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Create a new project', type: Project })
    @ApiBody({ type: CreateProjectDto })
    create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
        return this.projectService.create(createProjectDto);
    }

    @Put('/:id')
    @ApiResponse({ status: 200, description: 'Update project', type: Project })
    @ApiResponse({ status: 404, description: 'Not found' })
    @ApiBody({ type: UpdateProjectDto })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = this.projectService.update(id.toString(), updateProjectDto);
        if (!project) {
            throw new HttpException('Project not found', 404);
        }
        return project;
    }

    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'Delete project', type: DeleteResult })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: number): Promise<DeleteResult> {
        try {
            return this.projectService.remove(id);
        } catch (error) {
            console.error('Error removing project:', error);
            throw new NotFoundException('Project not found');
        }
    }
}