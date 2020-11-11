import { Test, TestingModule } from '@nestjs/testing';
import { DateRuleService } from './date-rule.service';

describe('DateRuleService', () => {
  let provider: DateRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateRuleService],
    }).compile();

    provider = module.get<DateRuleService>(DateRuleService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
