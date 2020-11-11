import { DateRuleType } from "src/utils/enums";
import { Interval } from "./interval";

export class DateRule {
    id: string;
    type: DateRuleType;
    intervals: Interval[]
}

export class DateRuleWeekly {
    weekdays: string[];
    date_rule: string;
}

export class DateRuleSpecific {
    date: Date;
    date_rule: string;
}




//date
/*
date rule

id string
type 
intervals array obj interval

------------------------


date-rule-weekly
weekdays
date-rule

date-rule-specific
date
date-rule


daily
weekly





*/

