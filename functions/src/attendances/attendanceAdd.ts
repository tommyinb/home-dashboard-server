import { storage } from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

export const attendanceAdd = onRequest(
  { cors: true },
  async (request, response) => {
    const { type } = request.query;

    if (type !== "arrive" && type !== "leave") {
      response.status(400).json({ error: "Invalid type parameter" });
      return;
    }

    const attendance: Attendance = {
      time: new Date(),
      type: type as AttendanceType,
    };

    await updateFile(attendance);

    response.json(attendance);
  }
);

type AttendanceType = "arrive" | "leave";

interface Attendance {
  time: Date;
  type: AttendanceType;
}

async function updateFile(attendance: Attendance) {
  const bucket = storage().bucket();
  const file = bucket.file(filePath);

  const [buffer] = await file.download();
  const oldText = buffer.toString("utf-8");
  const oldFile = JSON.parse(oldText) as File;

  const newFile: File = {
    attendances: [attendance, ...oldFile.attendances],
    time: attendance.time,
  };
  await file.save(JSON.stringify(newFile));
}

export const filePath = "attendances/attendance.json";

export interface File {
  attendances: Attendance[];
  time: Date;
}
