import { onSchedule } from "firebase-functions/scheduler";
import { storage } from "firebase-admin";
import { filePath, File } from "./attendanceAdd";

export const attendanceOutdate = onSchedule("0 0 * * 6", async (_event) => {
  const bucket = storage().bucket();
  const file = bucket.file(filePath);

  const [buffer] = await file.download();
  const oldText = buffer.toString("utf-8");
  const oldFile = JSON.parse(oldText) as File;

  const currentTime = new Date();
  const cutOffValue = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth() - 2,
    currentTime.getDate()
  );
  const cutOffText = cutOffValue.toISOString();

  const newFile: File = {
    attendances: oldFile.attendances
      .slice(0, 500)
      .filter((attendance) => `${attendance.time}` >= cutOffText),
    time: currentTime,
  };
  await file.save(JSON.stringify(newFile));
});
