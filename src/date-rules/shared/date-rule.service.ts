import { Injectable } from '@nestjs/common';
import * as mom from "moment";
import { formatDate } from 'src/utils/date';
const moment = require("moment").default || require("moment");
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

        const specificDateRules: DateRuleSpecific[] = this.dateRulesSpecific.map(
            dateRule => {
                const date = formatDate(dateRule.date.toString())
                if (
                    date >= moment(interval.start)
                    &&
                    date <= moment(interval.end)
                )
                    return dateRule;
            }
        );

        const weekDays: string[] = this.getWeekDays(interval);

        const weeklyDateRules: DateRuleWeekly[] = this.dateRulesWeekly.map(
            dateRule => {
                if (dateRule.weekdays.some(weekday =>
                    weekDays.includes(weekday)))
                    return dateRule;
            }
        );

        // falta mapear dia por dia

        // const ids = specificIds.concat(weeklyIds);


        let auxDate = interval.start;
        let arr = [];
        while (auxDate <= interval.end) {
            const day = `${auxDate.getDate()}-${auxDate.getMonth()+1}-${auxDate.getFullYear()}`;

            let intervaals: Interval[] = [];
            const weekDay = auxDate.getDay().toString();

            this.dateRules.forEach(dateRule => {
                if (dateRule.type == DateRuleType.DAILY) {
                    dateRule.intervals.forEach(interval => {
                        intervaals.push(interval);
                    });
                }
                specificDateRules.forEach(specificDateRule => {
                    const date = formatDate(specificDateRule.date.toString());
                    const specificDay = `${date.day()}-${date.month()+1}-${date.year()}`;
                    if (specificDateRule.date_rule == dateRule.id &&
                        specificDay == day) {
                        dateRule.intervals.forEach(interval => {
                            intervaals.push(interval);
                        });
                    }
                });

                weeklyDateRules.forEach(_weeklyDateRule => {
                    if (_weeklyDateRule.date_rule == dateRule.id && _weeklyDateRule.weekdays.includes(weekDay)) {
                        dateRule.intervals.forEach(interval => {
                            intervaals.push(interval);
                        });
                    }
                })
            });

            auxDate = moment(auxDate).add(1, 'day').toDate();

            arr.push({
                intervals: intervaals,
                day
            })
        }

        return arr;
        // return dateRules.map(dateRule => dateRule.intervals);

    }

    private getWeekDays(interval: Interval) {
        const weekdays = [];
        let currentDay = interval.start;
        while (currentDay < interval.end && weekdays.length <= 7) {
            const weekday = currentDay.getDay();
            if (!weekdays.includes(weekday))
                weekdays.push(currentDay.getDay());
            currentDay = moment(currentDay).add(1, 'day').toDate()
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
