import { Controller, Get, Post, Param, UseGuards, Body, Patch, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';
import { WorkItemService } from './work-item.service';

@Controller('work-item')
export class WorkItemController {
	constructor(private readonly workItemService: WorkItemService) { }


	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Request() req, @Body() createDto: CreateWorkItemDto, @Body('planId') planId:string, @Body('workId') workId:string) {
		return this.workItemService.create(req.user.id, createDto, planId, workId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/plan/:id')
	findAllPlanWorkItem(@Param('id') id: string) {
		return this.workItemService.findAllPlanWorkItem(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateDto: UpdateWorkItemDto) {
		return this.workItemService.update(id, updateDto);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/done/:id")
	done(@Param('id') id: string) {
		return this.workItemService.done(id);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/fail/:id")
	fail(@Param('id') id: string) {
		return this.workItemService.fail(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/detail/:id')
	findOne(@Param('id') id: string) {
		return this.workItemService.findOne(id);
	}
}
