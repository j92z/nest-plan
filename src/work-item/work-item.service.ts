import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';
import { User } from 'src/user/entities/user.entity';
import { Work } from 'src/work/entities/work.entity';
import { WorkStatus } from 'src/work/type.d/type';
import { WorkService } from 'src/work/work.service';
import { getManager, Repository } from 'typeorm';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';
import { WorkItem } from './entities/work-item.entity';
import { WorkItemStatus } from './typre.d/type';

@Injectable()
export class WorkItemService {

	constructor(
		@InjectRepository(WorkItem)
		private workItemRepository: Repository<WorkItem>,
		@InjectRepository(Work)
		private workRepository: Repository<Work>,
		@InjectRepository(Plan)
		private planRepository: Repository<Plan>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly workService: WorkService,
		private readonly planService: PlanService,
	) { }

	findOne(id: string) {
		return this.workItemRepository.findOne(id, { relations: ['work'] });
	}

	async create(userId: string, createDto: CreateWorkItemDto, planId: string, workId: string) {
		const user = await this.userRepository.findOne(userId);
		const workItem = this.workItemRepository.create(createDto);
		const dateTimestamp = new Date(workItem.date).getTime()
		workItem.dayWorkStartTime = (dateTimestamp + workItem.dayWorkStartTime) / 1000;
		workItem.dayWorkEndTime = (dateTimestamp + workItem.dayWorkEndTime) / 1000;
		workItem.result = '';
		workItem.user = user;
		if (workId) {
			const work = await this.workRepository.findOne(workId);
			workItem.work = work
		} else if (planId) {
			const plan = await this.planRepository.findOne(planId);
			workItem.plan = plan
		}
		return await this.workItemRepository.save(workItem);
	}

	async update(id: string, updateDto: UpdateWorkItemDto) {
		const dateTimestamp = new Date(updateDto.date).getTime()
		const workItem = await this.workItemRepository.findOne(id);
		workItem.name = updateDto.name;
		workItem.content = updateDto.content;
		workItem.date = updateDto.date;
		workItem.dayWorkStartTime = (dateTimestamp + updateDto.dayWorkStartTime) / 1000;
		workItem.dayWorkEndTime = (dateTimestamp + updateDto.dayWorkEndTime) / 1000;
		workItem.planCascaderPath = updateDto.planCascaderPath
		if (updateDto.planId) {
			const plan = await this.planRepository.findOne(updateDto.planId);
			workItem.plan = plan;
		} else if (updateDto.workId) {
			const work = await this.workRepository.findOne(updateDto.workId);
			workItem.work = work;
		} else {
			workItem.plan = null;
			workItem.work = null;
		}
		return this.workItemRepository.update(id, workItem);
	}

	async done(id: string) {
		var workDone = false;
		var planDone = false;
		var workItem = await this.workItemRepository.findOne(id, { relations: ['work', 'plan'] });
		if (workItem.work) {
			var itemNotDone = await this.workItemRepository.find({
				where: {
					work: workItem.work,
					status: WorkItemStatus.Process.toString()
				}
			});
			workDone = (itemNotDone.length === 1 && itemNotDone[0].id === id) || itemNotDone.length === 0
		} else if (workItem.plan) {
			var itemNotDone = await this.workItemRepository.find({
				where: {
					plan: workItem.plan,
					status: WorkItemStatus.Process.toString()
				}
			});
			// var workNotDoneCount = await this.workRepository.count({
			// 	where: {
			// 		plan: workItem.plan,
			// 		status: WorkStatus.Process.toString()
			// 	}
			// });
			var workNotDoneCount = await this.workRepository.count({ where: { plan: workItem.plan, status: WorkStatus.Process.toString() } })
			// var planNotDoneCount = await this.planRepository.count({
			// 	where: {
			// 		parent: workItem.plan,
			// 		status: WorkStatus.Process.toString()
			// 	}
			// });
			var planNotDoneCount = await this.planRepository.count({ where: { parent: workItem.plan, status: WorkStatus.Process.toString() } })
			planDone = ((itemNotDone.length === 1 && itemNotDone[0].id === id) || itemNotDone.length === 0) && workNotDoneCount === 0 && planNotDoneCount === 0
		}
		return await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager.getRepository(WorkItem).update(id, { status: WorkItemStatus.Success });
			if (workDone) {
				await this.workService.transactionDone(transactionalEntityManager, workItem.work.id);
			} else if (planDone) {
				await this.planService.transactionDone(transactionalEntityManager, workItem.plan.id);
			}
		});
	}

	fail(id: string) {
		return this.workItemRepository.update(id, { status: WorkItemStatus.Fail });
	}

	async findAllPlanWorkItem(planId: string) {
		const plan = await this.planRepository.findOne(planId);
		return this.workItemRepository.find({
			where: {
				plan: plan
			},
			order: {
				date: "ASC",
				dayWorkStartTime: "ASC"
			},
			relations: ['work']
		})
	}
}
