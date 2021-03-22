import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work } from './entities/work.entity';
import { WorkItem } from './entities/work_item.entity';

@Injectable()
export class WorkService {
	constructor(
		@InjectRepository(Work)
		private workRepository: Repository<Work>,
		@InjectRepository(WorkItem)
		private workItemRepository: Repository<WorkItem>,
	) {}
	create(createWorkDto: CreateWorkDto, dateList: string[]) {
		const work = this.workRepository.create(createWorkDto)

		getManager().transaction(async entityManger => {

			await entityManger.save(work);
		})
		return 'This action adds a new work';
	}

	private genDateByRule() {

	}

	findAll() {
		return `This action returns all work`;
	}

	findOne(id: number) {
		return `This action returns a #${id} work`;
	}

	update(id: number, updateWorkDto: UpdateWorkDto) {
		return `This action updates a #${id} work`;
	}

	remove(id: number) {
		return `This action removes a #${id} work`;
	}
}
