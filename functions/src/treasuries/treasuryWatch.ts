import { onRequest } from "firebase-functions/v2/https";
import { treasuryCheck } from "./treasuryCheck";

export const treasuryWatch = onRequest(
  { cors: true },
  async (_request, response) => {
    const result = await treasuryCheck();
    response.json(result);
  }
);
