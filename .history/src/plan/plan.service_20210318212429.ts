import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanService {
	constructor(
		@InjectRepository(Plan)
		private planRepository: Repository<Plan>,
		// private planTreeRepository: TreeRepository<Plan>,
	) { }

	async create(createPlanDto: CreatePlanDto, children: string[], parent: string) {
		var plan = {
			...createPlanDto,
			children: undefined,
			parent: undefined,
		}
		if (children.length > 0) {
			plan.children = await this.planRepository.find({where: {
				id: children
			}})
		}
		if (parent != "") {
			const info = await this.planRepository.findOne(parent).then(res=>{
				console.log(res)
			})
			plan.parent = info
			console.log(plan.parent, info)
		}
		console.log(plan)
		return this.planRepository.save(plan);
	}

	findAll() {
		return this.planRepository.find();
	}

	findOne(id: number) {
		return this.planRepository.findOne(id);
	}

	update(id: number, updatePlanDto: UpdatePlanDto) {
		return this.planRepository.update(id, updatePlanDto);
	}

	// async findTree(id: number) {
	// 	if (id > 0) {
	// 		const plan = await this.planRepository.findOne(id);
	// 		return await this.planTreeRepository.findDescendantsTree(plan);
	// 	}
	// 	return this.planTreeRepository.findTrees()
	// }

	remove(id: number) {
		return this.planRepository.delete(id);
	}
}
