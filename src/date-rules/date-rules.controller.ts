import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { formatDate } from 'src/utils/date';
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
    async create(@Body() dateRule: DateRule, @Headers() headers): Promise<DateRule> {
        let options;
        if (headers['options'])
            options = JSON.parse(headers['options']) || null;
        return this.dateRuleService.create(dateRule, options);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.dateRuleService.delete(id);
    }

    @Get(':list')
    async listInterval(@Headers() headers) {
        const interval = JSON.parse(headers['intervals']);
        interval.start = formatDate(interval.start).toDate();
        interval.end = formatDate(interval.end).toDate();

        return this.dateRuleService.listInterval(interval);
    }


    //- Apagar regra de horário para atendimento
    //Listar horários disponíveis dentro de um intervalo

}
