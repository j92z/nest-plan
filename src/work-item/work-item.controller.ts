import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkItemService } from './work-item.service';

@Controller('work-item')
export class WorkItemController {
	constructor(private readonly workItemService: WorkItemService) { }

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
