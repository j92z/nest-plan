import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { Work } from './entities/work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItem } from 'src/work-item/entities/work-item.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import { PlanModule } from 'src/plan/plan.module';


@Module({
	imports: [
		TypeOrmModule.forFeature([Work, WorkItem, Plan, User]),
		PlanModule
	],
	controllers: [WorkController],
	providers: [WorkService],
	exports: [WorkService]
})
export class WorkModule { }
