import { initializeApp } from "firebase-admin/app";
initializeApp();

export { hello } from "./hello";

export { gansoWatch } from "./watches/gansoWatch";
export { gansoSchedule } from "./watches/gansoSchedule";

export { treasuryWatch } from "./treasuries/treasuryWatch";
export { treasurySchedule } from "./treasuries/treasurySchedule";
