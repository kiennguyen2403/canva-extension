import { v } from "convex/values"
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";


const crons = cronJobs();

crons.weekly(
    "upload images to model",
    {
        dayOfWeek: 'monday',
        hourUTC: 17,
        minuteUTC: 30,
    },
    internal.images.uploadImagesToModel
);
export default crons;