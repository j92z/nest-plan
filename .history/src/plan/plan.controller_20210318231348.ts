import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) { }

	@Post()
	create(@Body() createPlanDto: CreatePlanDto) {
		return this.planService.create(createPlanDto);
	}

	@Get()
	findAll() {
		return this.planService.findAll();
	}

	@Get('detail/:id')
	findOne(@Param('id') id: string) {
		return this.planService.findOne(id);
	}

	@Get("tree")
	findTree() {
		return this.planService.findTree()
	}

	@Get("tree/detail/:id")
	findTreeById(@Param('id') id: string) {
		return this.planService.findTreeById(id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
		return this.planService.update(id, updatePlanDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.planService.remove(id);
	}
}
