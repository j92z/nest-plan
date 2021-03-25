import { Test, TestingModule } from '@nestjs/testing';
import { WorkItemController } from './work-item.controller';
import { WorkItemService } from './work-item.service';

describe('WorkItemController', () => {
  let controller: WorkItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkItemController],
      providers: [WorkItemService],
    }).compile();

    controller = module.get<WorkItemController>(WorkItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
