import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { Work } from './entities/work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from 'src/work-item/entities/work-item.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';


@Module({
	imports: [TypeOrmModule.forFeature([Work, WorkItem, Plan])],
	controllers: [WorkController],
	providers: [WorkService, PlanService]
})
export class WorkModule { }
