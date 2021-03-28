import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('work')
export class WorkController {
	constructor(private readonly workService: WorkService) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Request() req, @Body() createWorkDto: CreateWorkDto, @Body("dateList") dateList: string[], @Body("planId") planId: string) {
		return this.workService.create(req.user.id, createWorkDto, dateList, planId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/done/:id')
	done(@Param('id') id: string) {
		return this.workService.done(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAll() {
		return this.workService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('/collection/date')
	findDateCollection(@Request() req, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
		return this.workService.findDateCollection(req.user.id, startDate, endDate);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/detail/:id')
	findOne(@Param('id') id: string) {
		return this.workService.findOne(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto, @Body("dateList") dateList: string[], @Body("planId") planId: string) {
		return this.workService.update(id, updateWorkDto, dateList, planId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.workService.remove(id);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/fail/:id")
	fail(@Param('id') id: string) {
		return this.workService.fail(id);
	}
}
