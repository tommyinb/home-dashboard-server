import { onSchedule } from "firebase-functions/scheduler";
import { gansoCheck } from "./gansoCheck";

export const gansoSchedule = onSchedule("*/20 * * * *", async (_event) => {
  await gansoCheck();
});
