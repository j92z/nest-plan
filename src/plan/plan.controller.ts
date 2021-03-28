import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards, Request } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Request() req, @Body() createPlanDto: CreatePlanDto, @Body('parent') parent: string) {
		return this.planService.create(req.user.id, createPlanDto, parent);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/done/:id')
	done(@Param('id') id: string) {
		return this.planService.done(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAll() {
		return this.planService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('parent')
	findListByParent(@Request() req, @Query('id') id: string) {
		console.log(req)
		return this.planService.findByParent(req.user.id, id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('detail/:id')
	findOne(@Param('id') id: string) {
		return this.planService.findOne(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get("tree/list")
	findTree(@Request() req) {
		return this.planService.findTree(req.user.id)
	}

	@UseGuards(JwtAuthGuard)
	@Get("tree/detail/:id")
	findTreeById(@Param('id') id: string) {
		return this.planService.findTreeById(id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
		return this.planService.update( id, updatePlanDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		var childrenCount = await this.planService.countChildren(id)
		if (childrenCount > 0) {
			throw new HttpException("请先移除子计划", HttpStatus.BAD_REQUEST);
		}
		return this.planService.remove(id);
	}

	@UseGuards(JwtAuthGuard)
	@Post("/fail/:id")
	fail(@Param('id') id: string) {
		return this.planService.fail(id);
	}
}
