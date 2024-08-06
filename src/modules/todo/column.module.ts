import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProjectModule} from "./project.module";
import {ColumnEntity} from "./entities/column.entity";
import {ColumnController} from "./controllers/column.controller";
import {ColumnService} from "./services/column.service";
import {Project} from "./entities/project.entity";


@Module({
    controllers: [ColumnController],
    providers: [ColumnService],
    imports: [TypeOrmModule.forFeature([ColumnEntity, Project]), ProjectModule],
    exports: [ColumnService]
})

export class ColumnModule {}