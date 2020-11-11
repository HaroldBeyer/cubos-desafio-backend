import { Test, TestingModule } from '@nestjs/testing';
import { DateRulesController } from './date-rules.controller';

describe('DateRulesController', () => {
  let controller: DateRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateRulesController],
    }).compile();

    controller = module.get<DateRulesController>(DateRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
