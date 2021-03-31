import { Module } from '@nestjs/common';
import { WorkItemService } from './work-item.service';
import { WorkItemController } from './work-item.controller';
import { WorkItem } from './entities/work-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from 'src/work/entities/work.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { WorkModule } from 'src/work/work.module';
import { PlanModule } from 'src/plan/plan.module';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([WorkItem, Work, Plan, User]),
		PlanModule,
		WorkModule,
	],
	controllers: [WorkItemController],
	providers: [WorkItemService],
	exports: [WorkItemService]
})
export class WorkItemModule { }
