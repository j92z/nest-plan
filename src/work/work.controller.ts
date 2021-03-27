import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

@Controller('work')
export class WorkController {
	constructor(private readonly workService: WorkService) { }

	@Post()
	create(@Body() createWorkDto: CreateWorkDto, @Body("dateList") dateList: string[], @Body("planId") planId: string) {
		return this.workService.create(createWorkDto, dateList, planId);
	}

	@Post('/done/:id')
	done(@Param('id') id: string) {
		return this.workService.done(id);
	}

	@Get()
	findAll() {
		return this.workService.findAll();
	}

	@Get('/collection/date')
	findDateCollection(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
		return this.workService.findDateCollection(startDate, endDate);
	}

	@Get('/detail/:id')
	findOne(@Param('id') id: string) {
		return this.workService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto, @Body("dateList") dateList: string[], @Body("planId") planId: string) {
		return this.workService.update(id, updateWorkDto, dateList, planId);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.workService.remove(id);
	}
}
