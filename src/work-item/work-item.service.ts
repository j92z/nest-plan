import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkService } from 'src/work/work.service';
import { Repository } from 'typeorm';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';
import { WorkItem } from './entities/work-item.entity';
import { WorkItemStatus } from './typre.d/type';

@Injectable()
export class WorkItemService {

	constructor(
		@InjectRepository(WorkItem)
		private workItemRepository: Repository<WorkItem>,
		private workService: WorkService
	) { }

	create(_createWorkItemDto: CreateWorkItemDto) {
		return 'This action adds a new workItem';
	}

	findAll() {
		return `This action returns all workItem`;
	}

	findOne(id: number) {
		return `This action returns a #${id} workItem`;
	}

	update(id: number, _updateWorkItemDto: UpdateWorkItemDto) {
		return `This action updates a #${id} workItem`;
	}

	remove(id: number) {
		return `This action removes a #${id} workItem`;
	}

	async done(id: string) {
		var workItem = await this.workItemRepository.findOne(id, { relations: ['work'] });
		await this.workItemRepository.update(id, { status: WorkItemStatus.Success });
		this.workService.done(workItem.work.id)
	}
}
