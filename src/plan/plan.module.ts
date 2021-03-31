import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan } from './entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from 'src/work/entities/work.entity';
import { User } from 'src/user/entities/user.entity';
import { WorkItem } from 'src/work-item/entities/work-item.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Plan, Work, User, WorkItem]),
	],
	controllers: [PlanController],
	providers: [PlanService],
	exports: [PlanService],
})
export class PlanModule { }
