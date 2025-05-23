import { onSchedule } from "firebase-functions/scheduler";
import { treasuryCheck } from "./treasuryCheck";

export const treasurySchedule = onSchedule("20 */1 * * *", async (_event) => {
  await treasuryCheck();
});
