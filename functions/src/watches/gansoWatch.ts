import { onRequest } from "firebase-functions/v2/https";
import { gansoCheck } from "./gansoCheck";

export const gansoWatch = onRequest(
  { cors: true },
  async (_request, response) => {
    const result = await gansoCheck();
    response.json(result);
  }
);
