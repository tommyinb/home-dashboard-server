import { initializeApp } from "firebase-admin/app";
initializeApp();

export { hello } from "./hello";

export { treasuryWatch } from "./treasuries/treasuryWatch";
export { treasurySchedule } from "./treasuries/treasurySchedule";
