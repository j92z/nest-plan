import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';
import { PlanStatus } from 'src/plan/type.d/type';
import { WorkItem } from 'src/work-item/entities/work-item.entity';
import { EntityManager, getManager, MoreThan, Repository } from 'typeorm';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work } from './entities/work.entity';
import { WorkRepeatType, WorkStatus } from './type.d/type';

@Injectable()
export class WorkService {
	constructor(
		@InjectRepository(Work)
		private workRepository: Repository<Work>,
		@InjectRepository(WorkItem)
		private workItemRepository: Repository<WorkItem>,
		@InjectRepository(Plan)
		private planRepository: Repository<Plan>,
		private readonly planService: PlanService,
	) { }
	async create(createWorkDto: CreateWorkDto, dateList: string[], planId: string) {
		const work = this.workRepository.create(createWorkDto);
		if (planId) {
			const plan = await this.planRepository.findOne(planId);
			work.plan = plan;
		}
		if (dateList?.length == 0 || !dateList) {
			dateList = this.genDateByRule(work.repeatType, work.repeatStep, work.whichDay, work.startDate, work.endDate);
		}
		var newDateList = this.filterDateList(dateList)
		if (newDateList.length != dateList.length) {
			throw new HttpException("不可使用比当前更早的时间作为计划内安排", HttpStatus.BAD_REQUEST);
		}
		return await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager.save(work);
			for (var i = 0; i < dateList.length; i++) {
				const workItem = new WorkItem();
				workItem.date = dateList[i];
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
						thisMonth = 1;
						thisYear += 1;
					} else {
						thisMonth += 1;
					}
				}
				var tempTimestamp = (new Date(thisYear, thisMonth, whichDay)).getTime();
				while (tempTimestamp <= endTimestamp) {
					dateList.push((new Date(tempTimestamp)).toJSON().substr(0, 10));
					var tempDateObj = new Date(tempTimestamp);
					var tempYear = tempDateObj.getFullYear();
					var tempMonth = tempDateObj.getMonth();
					if (tempMonth == 12) {
						tempMonth = 1;
						tempYear += 1;
					} else {
						tempMonth += 1;
					}
					tempTimestamp = (new Date(tempYear, tempMonth, whichDay)).getTime();
				}
				break;
			case WorkRepeatType.Year:
				var tempTimestamp = startTimestamp + whichDay * 86400000;
				while (tempTimestamp <= endTimestamp) {
					dateList.push((new Date(tempTimestamp)).toJSON().substr(0, 10));
					var tempDateObj = new Date(tempTimestamp);
					tempTimestamp = tempDateObj.setFullYear(tempDateObj.getFullYear() + 1);
				}
				break;
			default:
				break;
		}
		return dateList;
	}

	private filterDateList(dateList: string[]) {
		var nowDateTimestamp = (new Date()).getTime() - 86400000;
		return dateList.filter((item) => {
			return nowDateTimestamp <= (new Date(item)).getTime();
		})
	}

	findAll() {
		return this.workRepository.find({ relations: ['workItems'] });
	}

	findOne(id: string) {
		return this.workRepository.findOne(id, { relations: ['workItems', 'plan'] });
	}

	async findDateCollection(startDate: string, endDate: string) {
		var workItems = await this.workItemRepository.createQueryBuilder("workItem")
			.leftJoinAndSelect("workItem.work", 'work')
			.where("workItem.date >= :startDate OR workItem.date <= :endDate", { startDate, endDate })
			.orderBy('workItem.date', 'ASC').getMany();
		var dateCollection: Map<string, WorkItem[]> = new Map();
		workItems.map((item) => {
			if (dateCollection[item.date] === undefined) {
				dateCollection[item.date] = [item];
			} else {
				dateCollection[item.date].push(item);
			}
		})
		return dateCollection;
	}

	async update(id: string, updateWorkDto: UpdateWorkDto, dateList: string[], planId: string) {
		var work = await this.workRepository.findOne(id);
		var newWork = this.workRepository.create(updateWorkDto);
		if (planId) {
			const plan = await this.planRepository.findOne(planId);
			newWork.plan = plan;
		}
		newWork.startDate = work.startDate;
		if (dateList?.length == 0 || !dateList) {
			dateList = this.genDateByRule(newWork.repeatType, newWork.repeatStep, newWork.whichDay, updateWorkDto.startDate, newWork.endDate);
		}
		dateList = this.filterDateList(dateList)
		if (dateList.length === 0) {
			throw new HttpException("计划更新后工作不可为空", HttpStatus.BAD_REQUEST);
		}
		var workItems = await this.workItemRepository.find({
			where: {
				work: work,
				date: MoreThan(new Date())
			}
		});
		return await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager.getRepository(Work).update(id, newWork);
			await transactionalEntityManager.getRepository(WorkItem).remove(workItems);
			for (var i = 0; i < dateList.length; i++) {
				const workItem = new WorkItem();
				workItem.date = dateList[i];
				workItem.dayWorkStartTime = newWork.dayWorkStartTime;
				workItem.dayWorkEndTime = newWork.dayWorkEndTime;
				workItem.result = '';
				workItem.work = work;
				await transactionalEntityManager.save(workItem);
			}
		});
	}

	async remove(id: string) {
		var work = await this.workRepository.findOne(id)
		var workItems = await this.workItemRepository.find({
			where: {
				work: work
			}
		})
		return await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager.getRepository(WorkItem).remove(workItems);
			await transactionalEntityManager.getRepository(Work).remove(work);
		});
	}

	async done(id: string) {
		return await getManager().transaction(async transactionalEntityManager => {
			await this.transactionDone(transactionalEntityManager, id);
		});
	}

	async transactionDone(transactionalEntityManager: EntityManager, id: string) {
		var work = await this.workRepository.findOne(id, { relations: ['plan'] });
		await transactionalEntityManager.getRepository(Work).update(id, { status: WorkStatus.Success });
		if (work.plan?.id) {
			var workNotDone = await this.workRepository.find({
				where: {
					plan: work.plan,
					status: WorkStatus.Process
				}
			});
			var planNotDoneCount = await this.planRepository.count({
				where: {
					parent: work.plan,
					status: PlanStatus.Process
				}
			});
			if (((workNotDone.length === 1 && workNotDone[0].id === id)
				|| workNotDone.length === 0)
				&& planNotDoneCount === 0) {
				await this.planService.transactionDone(transactionalEntityManager, work.plan.id);
			}
		}
	}
}
