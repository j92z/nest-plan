import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work } from './entities/work.entity';
import { WorkItem } from './entities/work_item.entity';
import { WorkRepeatType } from './type.d/type';

@Injectable()
export class WorkService {
	constructor(
		@InjectRepository(Work)
		private workRepository: Repository<Work>,
		@InjectRepository(WorkItem)
		private workItemRepository: Repository<WorkItem>,
	) { }
	async create(createWorkDto: CreateWorkDto, dateList: string[]) {
		const work = this.workRepository.create(createWorkDto);
		if (dateList?.length == 0 || !dateList) {
			dateList = this.genDateByRule(work.repeatType, work.repeatStep, work.whichDay, work.startDate, work.endDate);
		}
		return await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager.save(work);
			for (var i = 0; i < dateList.length; i ++) {
				var item = dateList[i]
				const workItem = new WorkItem();
				workItem.date = item;
				workItem.dayWorkStartTime = work.dayWorkStartTime;
				workItem.dayWorkEndTime = work.dayWorkEndTime;
				workItem.result = '';
				workItem.work = work;
				await transactionalEntityManager.save(workItem);
			}
		});
	}

	private genDateByRule(repeatType: WorkRepeatType, repeatStep: number, whichDay: number, startDate: string, endDate: string) {
		const startDateObj = new Date(startDate)
		const startTimestamp = startDateObj.getTime();
		const endTimestamp = (new Date(endDate)).getTime();
		const dateList: string[] = [];
		switch (repeatType) {
			case WorkRepeatType.Day:
				var tempTimestamp = startTimestamp;
				while (tempTimestamp <= endTimestamp) {
					dateList.push((new Date(tempTimestamp)).toJSON().substr(0, 10));
					tempTimestamp += repeatStep * 86400000;
				}
				break;
			case WorkRepeatType.Week:
				var weekDay = startDateObj.getDay();
				if (weekDay == 0) {
					weekDay = 7;
				}
				var tempTimestamp = whichDay < weekDay ? startTimestamp + (7 - weekDay + whichDay) * 86400000 : startTimestamp + (whichDay - weekDay) * 86400000;
				while (tempTimestamp <= endTimestamp) {
					dateList.push((new Date(tempTimestamp)).toJSON().substr(0, 10));
					tempTimestamp += repeatStep * 7 * 86400000;
				}
				break;
			case WorkRepeatType.Month:
				var dateDay = startDateObj.getDate();
				var thisMonth = startDateObj.getMonth();
				var thisYear = startDateObj.getFullYear();
				if (whichDay < dateDay) {
					if (thisMonth == 12) {
						thisMonth = 1
						thisYear += 1
					} else {
						thisMonth += 1
					}
				}
				var tempTimestamp = (new Date(thisYear, thisMonth, whichDay)).getTime()
				while (tempTimestamp <= endTimestamp) {
					dateList.push((new Date(tempTimestamp)).toJSON().substr(0, 10));
					var tempDateObj = new Date(tempTimestamp)
					var tempYear = tempDateObj.getFullYear()
					var tempMonth = tempDateObj.getMonth()
					if (tempMonth == 12) {
						tempMonth = 1
						tempYear += 1
					} else {
						tempMonth += 1
					}
					tempTimestamp = (new Date(tempYear, tempMonth, whichDay)).getTime()
				}
				break;
			case WorkRepeatType.Year:
				var tempTimestamp = startTimestamp + whichDay * 86400000;
				while (tempTimestamp <= endTimestamp) {
					dateList.push((new Date(tempTimestamp)).toJSON().substr(0, 10));
					var tempDateObj = new Date(tempTimestamp)
					tempTimestamp = tempDateObj.setFullYear(tempDateObj.getFullYear() + 1)
				}
				break;
			default:
				break;
		}
		return dateList;
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
