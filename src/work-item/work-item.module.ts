import { Module } from '@nestjs/common';
import { WorkItemService } from './work-item.service';
import { WorkItemController } from './work-item.controller';
import { WorkItem } from './entities/work-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([WorkItem])],
	controllers: [WorkItemController],
	providers: [WorkItemService]
})
export class WorkItemModule { }
