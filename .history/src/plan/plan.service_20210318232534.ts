import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, TreeRepository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {
	constructor(
		@InjectRepository(Plan)
		private planRepository: Repository<Plan>,
		@InjectRepository(Plan)
		private planTreeRepository: TreeRepository<Plan>,
	) { }

	async create(createPlanDto: CreatePlanDto) {
		const plan = new Plan()
		plan.name = createPlanDto.name
		plan.content = createPlanDto.content
		plan.costTime = createPlanDto.costTime
		plan.startTime = createPlanDto.startTime
		plan.sort = createPlanDto.sort
		plan.status = createPlanDto.status
		if (createPlanDto.children?.length > 0) {
			plan.children = await this.planRepository.find({where: {
				id: createPlanDto.children
			}})
		}
		if (createPlanDto.parent != "") {
			const info = await this.planRepository.findOne(createPlanDto.parent)
			plan.parent = info
		}
		return this.planRepository.save(plan);
	}

	findAll() {
		return this.planRepository.find();
	}

	findOne(id: string) {
		return this.planRepository.findOne(id);
	}

	async update(id: string, updatePlanDto: UpdatePlanDto) {
		const plan = new Plan()
		plan.name = updatePlanDto.name
		plan.content = updatePlanDto.content
		plan.costTime = updatePlanDto.costTime
		plan.startTime = updatePlanDto.startTime
		plan.sort = updatePlanDto.sort
		plan.status = updatePlanDto.status
		if (updatePlanDto.children?.length > 0) {
			plan.children = await this.planRepository.find({where: {
				id: In(updatePlanDto.children)
			}})
		}
		if (updatePlanDto.parent != "") {
			plan.parent = await this.planRepository.findOne(updatePlanDto.parent)
		}
		return this.planRepository.update(id, plan);
	}

	async findTreeById(id: string) {
		const plan = await this.planRepository.findOne(id);
		return await this.planTreeRepository.findDescendantsTree(plan);
	}

	findTree() {
		return this.planTreeRepository.findTrees()
	}

	remove(id: string) {
		return this.planRepository.delete(id);
	}
}
