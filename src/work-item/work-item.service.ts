import { Injectable } from '@nestjs/common';
import { CreateWorkItemDto } from './dto/create-work-item.dto';
import { UpdateWorkItemDto } from './dto/update-work-item.dto';

@Injectable()
export class WorkItemService {
  create(createWorkItemDto: CreateWorkItemDto) {
    return 'This action adds a new workItem';
  }

  findAll() {
    return `This action returns all workItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workItem`;
  }

  update(id: number, updateWorkItemDto: UpdateWorkItemDto) {
    return `This action updates a #${id} workItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} workItem`;
  }
}
