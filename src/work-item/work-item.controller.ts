import { Controller, Get, Post, Param } from '@nestjs/common';
import { WorkItemService } from './work-item.service';

@Controller('work-item')
export class WorkItemController {
	constructor(private readonly workItemService: WorkItemService) { }

	@Post("/done/:id")
	done(@Param('id') id: string) {
		return this.workItemService.done(id);
	}

	@Get('/detail/:id')
	findOne(@Param('id') id: string) {
		return this.workItemService.findOne(id);
	}
}
