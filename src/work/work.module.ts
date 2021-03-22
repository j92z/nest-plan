import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { Work } from './entities/work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from './entities/work_item.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Work, WorkItem])],
	controllers: [WorkController],
	providers: [WorkService]
})
export class WorkModule { }
