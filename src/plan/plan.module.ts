import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan } from './entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from 'src/work/entities/work.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Plan, Work, User]),
		AuthModule
	],
	controllers: [PlanController],
	providers: [PlanService]
})
export class PlanModule { }
