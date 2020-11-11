import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { DateRule } from './shared/date-rule';
import { DateRuleService } from './shared/date-rule.service';
import { Interval } from './shared/interval';

@Controller('date-rules')
export class DateRulesController {

    constructor(private dateRuleService: DateRuleService) {

    }
    @Get()
    async getAll(): Promise<DateRule[]> {
        return this.dateRuleService.getAll();
    }

    @Post()
    async create(@Body() dateRule: DateRule, @Query() options?: {}): Promise<DateRule> {
        return this.dateRuleService.create(dateRule, options);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.dateRuleService.delete(id);
    }

    @Get(':list')
    async listInterval(@Body() interval: Interval) {
        return this.dateRuleService.listInterval(interval);
    }


    //- Apagar regra de horário para atendimento
    //Listar horários disponíveis dentro de um intervalo

}
