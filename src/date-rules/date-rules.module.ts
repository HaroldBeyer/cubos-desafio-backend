import { Module } from '@nestjs/common';
import { DateRulesController } from './date-rules.controller';
import { DateRuleService } from './shared/date-rule.service';

@Module({
  controllers: [DateRulesController],
  providers: [DateRuleService]
})
export class DateRulesModule {}
