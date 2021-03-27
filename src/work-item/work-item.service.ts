import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkService } from 'src/work/work.service';
import { getManager, Repository } from 'typeorm';
import { WorkItem } from './entities/work-item.entity';
import { WorkItemStatus } from './typre.d/type';

@Injectable()
export class WorkItemService {

	constructor(
		@InjectRepository(WorkItem)
		private workItemRepository: Repository<WorkItem>,
		private readonly workService: WorkService,
	) { }

	findOne(id: string) {
		return this.workItemRepository.findOne(id, { relations: ['work'] });
	}

	async done(id: string) {
		var workItem = await this.workItemRepository.findOne(id, { relations: ['work'] });
		var itemNotDone = await this.workItemRepository.find({
			where: {
				work: workItem.work,
				status: WorkItemStatus.Process
			}
		});
		return await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager.getRepository(WorkItem).update(id, { status: WorkItemStatus.Success });
			if ((itemNotDone.length === 1 && itemNotDone[0].id === id) || itemNotDone.length === 0) {
				await this.workService.transactionDone(transactionalEntityManager, workItem.work.id)
			}
		});
	}
}
