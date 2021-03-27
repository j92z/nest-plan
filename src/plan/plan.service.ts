import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from 'src/work/entities/work.entity';
import { WorkStatus } from 'src/work/type.d/type';
import { EntityManager, getManager, Repository, TreeRepository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { PlanStatus } from './type.d/type';

@Injectable()
export class PlanService {
	constructor(
		@InjectRepository(Plan)
		private planRepository: Repository<Plan>,
		@InjectRepository(Plan)
		private planTreeRepository: TreeRepository<Plan>,
		@InjectRepository(Work)
		private workRepository: Repository<Work>,
	) { }

	async create(createPlanDto: CreatePlanDto) {
		const plan = new Plan()
		plan.name = createPlanDto.name
		plan.content = createPlanDto.content
		plan.costTime = createPlanDto.costTime
		plan.sort = createPlanDto.sort
		plan.status = createPlanDto.status
		plan.planCascaderPath = createPlanDto.planCascaderPath
		if (createPlanDto.parent != "") {
			const info = await this.planRepository.findOne(createPlanDto.parent)
			plan.parent = info
		}
		return this.planRepository.save(plan);
	}

	findAll() {
		return this.planRepository.find({
			order: {
				sort: "DESC"
			}
		});
	}

	findByParent(parent: string) {
		return this.planRepository.find({
			where: {
				parent: parent ? parent : null,
			},
			order: {
				sort: "DESC"
			},
			relations: ['children']
		});
	}

	findOne(id: string) {
		return this.planRepository.findOne(id, {
			relations: ['parent', 'children', 'works']
		});
	}

	async update(id: string, updatePlanDto: UpdatePlanDto) {
		const plan = new Plan()
		plan.name = updatePlanDto.name
		plan.content = updatePlanDto.content
		plan.costTime = updatePlanDto.costTime
		plan.sort = updatePlanDto.sort
		plan.status = updatePlanDto.status
		plan.planCascaderPath = updatePlanDto.planCascaderPath
		if (updatePlanDto.parent != "") {
			plan.parent = await this.planRepository.findOne(updatePlanDto.parent)
		} else {
			plan.parent = null
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

	async countChildren(id: string) {
		return await this.planRepository.count({
			where: {
				parent: id
			}
		})
	}


	async done(id: string) {
		return await getManager().transaction(async transactionalEntityManager => {
			await this.transactionDone(transactionalEntityManager, id);
		});
	}

	async transactionDone(transactionalEntityManager: EntityManager, id: string) {
		var plan = await this.planRepository.findOne(id, { relations: ['parent'] });
		await transactionalEntityManager.getRepository(Plan).update(id, { status: PlanStatus.Success });
		if (plan.parent?.id) {
			var planNotDone = await this.planRepository.find({
				where: {
					parent: plan.parent,
					status: PlanStatus.Process
				}
			});
			var workNotDoneCount = await this.workRepository.count({
				where: {
					plan: plan.parent,
					status: WorkStatus.Process
				}
			});
			if (workNotDoneCount === 0 &&
				(planNotDone.length === 0
					|| (planNotDone.length === 1 && planNotDone[0].id === id))) {
				await this.transactionDone(transactionalEntityManager, plan.parent.id);
			}
		}
	}
}
