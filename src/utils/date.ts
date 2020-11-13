import * as mom from "moment";
const moment = require("moment").default || require("moment");

export function formatDate(date: string) : moment.Moment  {
    //19-12-2020
    const year = date.slice(6);
    const month = date.slice(3,5);
    const day = date.slice(0, 2);

    const newDate = `${year}-${month}-${day}`;
    return moment(newDate);
}