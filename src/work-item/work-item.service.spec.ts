import { Test, TestingModule } from '@nestjs/testing';
import { WorkItemService } from './work-item.service';

describe('WorkItemService', () => {
  let service: WorkItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkItemService],
    }).compile();

    service = module.get<WorkItemService>(WorkItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
