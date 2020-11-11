import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';
import moment from 'moment';
import { DateRuleType } from 'src/utils/enums';
import { createUniqueId } from 'src/utils/id';
import { DateRule, DateRuleSpecific, DateRuleWeekly } from './date-rule';
import { Interval } from './interval';
const db = require('../../../db.json');

@Injectable()
export class DateRuleService {
    dateRules: DateRule[] = db['date-rules'];
    dateRulesWeekly: DateRuleWeekly[] = db['date-rule-weekly'];
    dateRulesSpecific: DateRuleSpecific[] = db['date-rule-specific'];

    getAll() {
        return this.dateRules;
    }

    delete(id: string) {
        const index = this.dateRules.findIndex(dateRule => dateRule.id == id);
        const dateRule = this.dateRules.find(dateRule => dateRule.id);
        switch (dateRule.type) {
            case DateRuleType.SPECIFIC:
                this.handleSpecificRemoval(id);
                break;
            case DateRuleType.WEEKLY:
                this.handleWeeklyRemoval(id);
                break;
        }

        this.dateRules.splice(index, 1);
    }


    create(dateRule: DateRule, opt?: {}) {
        dateRule.id = createUniqueId(this.dateRules);
        switch (dateRule.type) {
            case DateRuleType.SPECIFIC:
                this.handleSpecificCreation(opt, dateRule);
                break;
            case DateRuleType.WEEKLY:
                this.handleWeeklyCreation(opt, dateRule);
                break;
            case DateRuleType.DAILY:
                this.dateRules.push(dateRule);
                break;
        }

        return dateRule;
    }

    listInterval(interval: Interval) {
        // const start = moment(interval.start);
        // const end = moment(interval.end);

        const specificIds: string[] = this.dateRulesSpecific.map(
            dateRule => {
                if (
                    dateRule.date >= interval.start
                    &&
                    dateRule.date <= interval.end
                )
                    return dateRule.date_rule;
            }
        );

        const weekDays: string[] = this.getWeekDays(interval);

        const weeklyIds: string[] = this.dateRulesWeekly.map(
            dateRule => {
                if (dateRule.weekdays.some(weekday =>
                    weekDays.includes(weekday)))
                    return dateRule.date_rule;
            }
        );

        const ids = specificIds.concat(weeklyIds);

        const dateRules = this.dateRules.map(dateRule => {
            if (dateRule.type == DateRuleType.DAILY)
                return dateRule;

            if (ids.includes(dateRule.id))
                return dateRule;
        });

        return dateRules.map(dateRule => dateRule.intervals);

    }

    private getWeekDays(interval: Interval) {
        const weekdays = [];
        let currentDay = moment(interval.start);
        while (currentDay.toDate() < interval.end && weekdays.length <= 7) {
            const weekday = currentDay.weekday;
            if (!weekdays.includes(weekday))
                weekdays.push(currentDay.weekday);
            currentDay = currentDay.add(1, 'day');
        }
        return weekdays;
    }


    //refactor => create a event emitter for all of this

    private handleWeeklyCreation(opt: {}, dateRule: DateRule) {
        if (!opt['weekdays'])
            throw (new Error("Você precisa especificar os dias da semana"));

        this.dateRules.push(dateRule);

        const weeklyDateRule: DateRuleWeekly = {
            date_rule: dateRule.id,
            weekdays: opt['weekdays']
        };

        this.dateRulesWeekly.push(weeklyDateRule);
    }

    private handleSpecificCreation(opt: {}, dateRule: DateRule) {
        if (!opt['date'])
            throw (new Error("Você precisa especificar uma data"));

        this.dateRules.push(dateRule);

        const specificDateRule: DateRuleSpecific = {
            date: opt['date'],
            date_rule: dateRule.id
        };

        this.dateRulesSpecific.push(specificDateRule);
    }

    private handleWeeklyRemoval(id: string) {
        const weeklyIndex = this.dateRulesWeekly.findIndex(dateRule => dateRule.date_rule == id);

        this.dateRulesWeekly.slice(weeklyIndex, 1);
    }

    private handleSpecificRemoval(id: string) {
        const specificIndex = this.dateRulesSpecific.findIndex(dateRule => dateRule.date_rule == id);

        this.dateRulesSpecific.splice(specificIndex, 1);
    }

    //- Cadastrar regras de horários para atendimento
    //- Apagar regra de horário para atendimento
    //Listar horários disponíveis dentro de um intervalo

}
