import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkItemService } from './work-item.service';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';

@Controller('work-item')
export class WorkItemController {
  constructor(private readonly workItemService: WorkItemService) {}

  @Post()
  create(@Body() createWorkItemDto: CreateWorkItemDto) {
    return this.workItemService.create(createWorkItemDto);
  }

  @Get()
  findAll() {
    return this.workItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkItemDto: UpdateWorkItemDto) {
    return this.workItemService.update(+id, updateWorkItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workItemService.remove(+id);
  }
}
