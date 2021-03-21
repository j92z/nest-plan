import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
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

	@Get('parent')
	findListByParent(@Query('id') id: string) {
		return this.planService.findByParent(id);
	}

	@Get('detail/:id')
	findOne(@Param('id') id: string) {
		return this.planService.findOne(id);
	}

	@Get("tree/list")
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
	async remove(@Param('id') id: string) {
		var childrenCount = await this.planService.countChildren(id)
		if (childrenCount > 0) {
			throw new HttpException("请先移除子计划", HttpStatus.BAD_REQUEST);
		}
		return this.planService.remove(id);
	}
}
