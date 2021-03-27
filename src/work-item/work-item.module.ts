import { Module } from '@nestjs/common';
import { WorkItemService } from './work-item.service';
import { WorkItemController } from './work-item.controller';
import { WorkItem } from './entities/work-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkService } from 'src/work/work.service';
import { Work } from 'src/work/entities/work.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';

@Module({
	imports: [TypeOrmModule.forFeature([WorkItem, Work, Plan])],
	controllers: [WorkItemController],
	providers: [WorkItemService, WorkService, PlanService]
})
export class WorkItemModule { }
