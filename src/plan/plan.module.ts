import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan } from './entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from 'src/work/entities/work.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Plan, Work])],
	controllers: [PlanController],
	providers: [PlanService]
})
export class PlanModule { }
