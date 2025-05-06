import { checkBirthdays, checkUnpaidShares } from "./jobs.js";

const schedules = [
    {
        cron: "0 8 * * *",
        task: checkBirthdays,
    },
    {
        cron: "0 8 * * *",
        task: checkUnpaidShares,
    }
];

export default schedules;