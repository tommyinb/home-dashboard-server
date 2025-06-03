import { initializeApp } from "firebase-admin/app";
initializeApp();

export { hello } from "./hellos/hello";

export { treasuryWatch } from "./treasuries/treasuryWatch";
export { treasurySchedule } from "./treasuries/treasurySchedule";

export { attendanceAdd } from "./attendances/attendanceAdd";
export { attendanceOutdate } from "./attendances/attendanceOutdate";
