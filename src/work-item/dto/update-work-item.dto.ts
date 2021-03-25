import { PartialType } from '@nestjs/swagger';
import { CreateWorkItemDto } from './create-work-item.dto';

export class UpdateWorkItemDto extends PartialType(CreateWorkItemDto) {}
