import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DateRulesModule } from './date-rules/date-rules.module';

@Module({
  imports: [DateRulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
