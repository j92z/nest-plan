import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
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
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) { }

	async create(userId: string, createPlanDto: CreatePlanDto, parent: string) {
		const user = await this.userRepository.findOne(userId)
		const plan = this.planRepository.create(createPlanDto)
		plan.status = PlanStatus.Process
		plan.user = user
		if (parent != "") {
			const info = await this.planRepository.findOne(parent)
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

	async findByParent(userId: string, parent: string) {
		const user = await this.userRepository.findOne(userId)
		return this.planRepository.find({
			where: {
				parent: parent ? parent : null,
				user: user
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
		const plan = await this.planRepository.findOne(id)
		plan.name = updatePlanDto.name
		plan.content = updatePlanDto.content
		plan.sort = updatePlanDto.sort
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

	async findTree(userId: string) {
		const user = await this.userRepository.findOne(userId)
		return this.findUserPlanTree(user, null);
	}

	private async findUserPlanTree(user: User, parent: Plan | null) {
		var planList = await this.planRepository.find({
			where: {
				parent: parent,
				user: user
			},
			order: {
				sort: "DESC"
			},
			relations: ['children']
		});
		for (var key in planList) {
			for (var childrenKey in planList[key].children) {
				planList[key].children[childrenKey].children = await this.findUserPlanTree(user, planList[key].children[childrenKey]);
				if (planList[key].children[childrenKey].children.length === 0) {
					delete planList[key].children[childrenKey].children;
				}
			}
			if (planList[key].children.length === 0) {
				delete planList[key].children;
			}
		}
		return planList;
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
					status: PlanStatus.Process.toString()
				}
			});
			var workNotDoneCount = await this.workRepository.count({
				where: {
					plan: plan.parent,
					status: WorkStatus.Process.toString()
				}
			});
			if (workNotDoneCount === 0 &&
				(planNotDone.length === 0
					|| (planNotDone.length === 1 && planNotDone[0].id === id))) {
				await this.transactionDone(transactionalEntityManager, plan.parent.id);
			}
		}
	}

	fail(id: string) {
		return this.planRepository.update(id, { status: PlanStatus.Fail });
	}
}
